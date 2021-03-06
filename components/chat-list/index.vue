<template>
  <div id="chat-list-wrapper"
    v-if="user.account && user.account.id && chat.imClient">
    <div class="chat-list-btn" @click="onShowList">
      <div class="chat-list-btn-rotate">
        <i class="iconfont icon-talk"></i>
        <sup class="chat-badge" v-show="hasUnreadMessage"><span>NEW</span></sup>
      </div>
    </div>
    <transition name="chat-list-fade">
      <div class="chat-list" v-show="showList" v-prevent-parent-scroll>
        <ul>
          <li class="chat-list-item" v-for="item in convList" :key="item.id" @click="toOrderDetail(item)" @mouseover="item._showBtn = true" @mouseout="item._showBtn = false">
            <div>
              <UserAvatar :username="item._otherMembers[0]" :online="false" :color="item._defaultColor" :size="42" :dot="item._unreadMessageCount > 0"></UserAvatar>
            </div>
            <div class="chat-list-item-detail">
              <div class="detail-wrapper detail-col1">
                <span class="detail-content detail-members">{{ item._otherMembers.join('、') }}</span>
                <span class="detail-time">{{ item._formatTime }}</span>
              </div>
              <div class="detail-wrapper detail-col2">
                <span class="detail-content detail-text" v-if="item.lastMessage">
                  <template v-if="item.lastMessage.content._lctype === messageType.order">
                    <template v-if="item.lastMessage.content._lctext === 'order_create'">
                      <template v-if="item._side === 'buyer'">
                        {{ orderMessages[item.lastMessage.content._lctext].me }}
                      </template>
                      <template v-else-if="item._side === 'seller'">
                        {{ orderMessages[item.lastMessage.content._lctext].other }}
                      </template>
                      <template v-else>
                        {{ orderMessages[item.lastMessage.content._lctext].customer }}
                      </template>
                    </template>
                    <template v-else>
                      {{ item.lastMessage.from === `${user.account.id}` ? orderMessages[item.lastMessage.content._lctext].me : orderMessages[item.lastMessage.content._lctext].other }}
                    </template>
                  </template>
                  <template v-else-if="[messageType.text, messageType.auto].indexOf(item.lastMessage.content._lctype) > -1">
                    {{ item.lastMessage.content._lctext }}
                  </template>
                  <template v-else-if="item.lastMessage.content._lctype === messageType.image">
                    [图片]
                  </template>
                  <template v-else>
                    [未知消息类型]
                  </template>
                </span>
                <span class="detail-tag" @click.stop="onRead(item)" v-if="item._unreadMessageCount > 0 && item._showBtn">标为已读</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
  import { Event } from 'leancloud-realtime';
  import { mapState } from 'vuex';
  import UserAvatar from '~/components/chat/avatar';
  import preventParentScroll from 'vue-prevent-parent-scroll';
  import { COLORS, MESSAGE_TYPE, ORDER_MESSAGES } from '~/components/chat/constant.js';

  export default {
    data() {
      return {
        orderMessages: ORDER_MESSAGES,
        messageType: MESSAGE_TYPE,
        colors: COLORS,
        showList: false,
        convList: [], // 对话列表
        maxLimit: 20, // 对话列表条数
        clientEventMap: {},
      };
    },
    directives: {
      preventParentScroll, // 阻止滚动下拉框时候body滚动
    },
    components: {
      UserAvatar,
    },
    computed: {
      ...mapState(['chat', 'user']),
      hasUnreadMessage() {  // 列表是否有未读消息
        return this.convList.some(conv => {
          return conv._unreadMessageCount > 0;
        });
      },
      tips() {
        return !this.convList.length ? '您还未收到任何消息' : '';
      },
    },
    watch: {
      'user.account'(account) {
        if (!this.chat.imClient && account && account.id) {
          const clientId = `${account.id}`;
          this.$store.dispatch('chat/newChatClient', clientId)
            .then(() => {
              this.init();
            })
            .catch(err => {
              this.$errorTips(`初始化聊天失败，error=${err}`);
            });
          this.$nuxt.$on('IM.Event.SINGLE_MESSAGE_UPDATE', () => {  // 手动强制更新聊天列表
            this.fetchMessageList({
              success: (convList) => {
                this.convList = convList;
              },
            });
          });
        }
      },
    },
    beforeDestroy() {
      this.unbindClientEvent();
      this.$nuxt.$off('IM.Event.SINGLE_MESSAGE_UPDATE');
    },
    methods: {
      init() {
        this.fetchMessageList({
          success: (convList) => {
            this.convList = convList;
          },
          error: (err) => {
            console.error(`获取消息列表失败，error=${err}`); // 不显示错误提示
          },
        });
        this.bindClientEvent(); // 绑定事件
      },
      onRead(curConv) {
        if (this.chat.imClient) {
          this.chat.imClient
            .getConversation(curConv.id)
            .then(conv => {
              if (conv) {
                conv
                  .read()
                  .catch(err => {
                    this.$errorTips(`标记已读失败，error=${err}`);
                  });
              }
            })
            .catch(err => {
              this.$errorTips(`获取对话失败，error=${err}`);
            });
        }
      },
      toOrderDetail(item) {
        const { _attributes: { attr: { order }, name } } = item;
        let orderId;
        if (order && order.id) { // 兼容旧数据，优先使用扩展字段id
          orderId = order.id;
        } else if (name) {
          orderId = name.match(/\d+/);
        }
        if (orderId) {
          this.$router.push(`/orders/${orderId}`);
        }
      },
      onShowList() {
        if (!this.convList.length) return;
        this.showList = !this.showList;
      },
      fetchMessageList(options = {}) {
        const todayString = new Date().toDateString();
        const myClientId = `${this.user.account.id}`;
        this.chat.imClient
          .getQuery()
          .limit(this.maxLimit)
          .withLastMessagesRefreshed(true)
          .containsMembers([myClientId])
          .find()
          .then(conversations => {
            const convList = [];
            // 默认按每个对话的最后更新日期（收到最后一条消息的时间）倒序排列
            conversations.forEach(conv => {
              const otherMembers = [];
              let defaultColor;
              conv.members.forEach(member => { // 找出除了自己以外的用户
                const { _attributes: { attr: { username } } } = conv;
                if (member !== myClientId && username && username[member]) {
                  if (!otherMembers.length) {
                    defaultColor = this.colors[member % 10];
                  }
                  otherMembers.push(username[member]);
                }
              });
              if (defaultColor) { // 排除只有自己的对话
                const date = conv.lastMessageAt;
                let formatTime;
                if (date) {
                  if (todayString === date.toDateString()) { // 时间为今天内，显示时:分
                    formatTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                  } else { // 时间为昨天以前，显示日期
                    formatTime = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
                  }
                }
                const orderInfo = conv._attributes.attr.order;
                let side = 'buyer';
                if (orderInfo) {
                  if (+orderInfo.buyer === +myClientId) {
                    side = 'buyer';
                  } else if (+orderInfo.seller === +myClientId) {
                    side = 'seller';
                  } else {
                    side = 'customer';
                  }
                }
                convList.push({
                  ...conv,
                  _side: side, // 当前用户身份：买方、卖方、客服
                  _showBtn: false, // 是否显示已读按钮
                  _formatTime: formatTime,
                  _otherMembers: otherMembers, // 除了自己以外的聊天用户
                  _defaultColor: defaultColor, // 头像颜色，取第一个用户id尾号
                  _unreadMessageCount: conv.unreadMessagesCount || 0,
                });
              }
            });
            if (options.success) {
              options.success(convList);
            }
          })
          .catch(err => {
            if (options.error) {
              options.error(err);
            }
          });
      },
      bindClientEvent() {
        const self = this;
        this.clientEventMap = {
          [Event.MESSAGE]: (message) => {
            self.fetchMessageList({
              success: (convList) => {
                self.convList = convList;
              },
            });
          },
          [Event.UNREAD_MESSAGES_COUNT_UPDATE]: (conversations) => {
            conversations.forEach(conv => {
              const findConv = self.convList.find(item => {
                return item.id === conv.id;
              });
              if (findConv) {
                self.$set(findConv, '_unreadMessageCount', conv.unreadMessagesCount);
              }
            });
            self.$nuxt.$emit('IM.Event.UNREAD_MESSAGES_COUNT_UPDATE', conversations); // 发送全局事件
          },
        };
        Object.keys(this.clientEventMap).forEach(evtType => {
          this.chat.imClient.on(evtType, this.clientEventMap[evtType]);
        });
      },
      unbindClientEvent() {
        if (this.chat.imClient) {
          Object.keys(this.clientEventMap).forEach(evtType => {
            this.chat.imClient.off(evtType);
          });
        }
      },
    },
  };
</script>

<style lang="scss">
  #chat-list-wrapper {
    .chat-list-btn {
      position: relative;
      width: 60px;
      height: 60px;
      line-height: 60px;
      background-image: linear-gradient(to left, #22e6b8, #00c1ce);
      border-radius: 100px;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
      text-align: center;
      cursor: pointer;
      .chat-list-btn-rotate {
        transition: all .5s ease-in-out;
        &:hover {
          transform: rotate(360deg);
        }
      }
      .icon-talk {
        color: #fff;
        font-size: 35px;
      }
      .chat-badge {
        position: absolute;
        top: 14px;
        right: 38px;
        display: inline-block;
        height: 14px;
        line-height: 14px;
        font-size: 12px;
        padding: 0 1px;
        text-align: center;
        white-space: nowrap;
        border-radius: 10px;
        color: #fff;
        transform: translate3d(100%, -50%, 0);
        background-color: #e35555;
        span {
          display: inline-block;
          transform: scale(.8);
        }
      }
    }
    .chat-list-fade-enter-active, .chat-list-fade-leave-active {
      transition: opacity .5s;
    }
    .chat-list-fade-enter, .chat-list-fade-leave-to {
      opacity: 0;
    }
    .chat-list {
      position: absolute;
      right: 0;
      bottom: 75px;
      width: 400px;
      height: auto;
      max-height: 460px;
      flex-grow: 1;
      flex-shrink: 1;
      background-color: #fff;
      box-shadow: 0 0 20px 0 #dddddd;
      overflow-y: auto;
      .chat-list-item {
        padding: 11px 20px 13px 20px;
        display: flex;
        align-items: center;
        cursor: pointer;
        border-bottom: solid 1px #eeeeee;
        .chat-list-item-detail {
          margin-left: 10px;
          width: 100%;
          .detail-wrapper {
            display: flex;
            height: 20px;
            color: #27313e;
            justify-content: space-between;
            .detail-content {
              display: inline-block;
              width: 224px;
              margin-right: 5px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .detail-tag {
              display: inline-block;
              width: 62px;
              height: 18px;
              text-align: center;
              line-height: 16px;
              border-radius: 9px;
              border: solid 1px #52cbca;
              font-size: 12px;
              color: #52cbca;
              overflow: hidden;
              &:hover {
                color: #fff;
                background-image: linear-gradient(to left, #22e6b8, #00c1ce);
              }
            }
            .detail-time {
              display: inline-block;
              width: 45px;
              text-align: right;
              font-size: 12px;
              color: #9b9b9b;
              overflow: hidden;
            }
            .detail-text {
              color: #9b9b9b;
            }
          }
          .detail-col1 {
            line-height: 20px;
            .detail-members {
              font-weight: 500;
              color: #27313e;
            }
          }
          .detail-col2 {
            line-height: 24px;
          }
        }
      }
    }
  }
</style>
