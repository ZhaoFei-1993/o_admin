<template>
  <div id="chat-list-wrapper"
    v-if="user.account && user.account.id && chat.imClient">
    <div class="chat-list-btn" @click="onShowList">
      <div class="chat-list-btn-rotate">
        <i class="iconfont icon-talk"></i>
        <sup class="chat-badge" v-show="hasUnreadMessage"></sup>
      </div>
    </div>
    <transition name="chat-list-fade">
      <div class="chat-list" v-show="showList" v-prevent-parent-scroll>
        <ul>
          <li class="chat-list-item" v-for="item in convList" :key="item.id" @click="toOrderDetail(item._attributes.name)" @mouseover="item._showBtn = true" @mouseout="item._showBtn = false">
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
                  <template v-if="[messageType.text, messageType.auto].indexOf(item.lastMessage.content._lctype) > -1">
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
  import { Event, TextMessage } from 'leancloud-realtime'
  import { ImageMessage } from 'leancloud-realtime-plugin-typed-messages'
  import { mapState } from 'vuex'
  import UserAvatar from '~/components/chat/avatar'
  import preventParentScroll from 'vue-prevent-parent-scroll'
  import {COLORS} from '~/common/constants'

  export default {
    data() {
      return {
        messageType: {
          image: ImageMessage.TYPE,
          text: TextMessage.TYPE,
          auto: -101, // 自动回复
        },
        showList: false,
        convList: [], // 对话列表
        maxLimit: 20, // 对话列表条数
        clientEventMap: {},
      }
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
          return conv._unreadMessageCount > 0
        })
      },
      tips() {
        return !this.convList.length ? '您还未收到任何消息' : ''
      },
    },
    watch: {
      'chat.imClient'(newVal, oldVal) {
        if (newVal && !oldVal) {
          this.init()
        }
      },
    },
    mounted() {
      if (this.chat.imClient) {
        this.init() // 从不同layout跳转过来时候需要初始化一次
      }
    },
    beforeDestroy() {
      this.unbindClientEvent()
    },
    methods: {
      init() {
        this.fetchMessageList({
          success: (convList) => {
            this.convList = convList
          },
          error: (err) => {
            console.error(`获取消息失败，error=${err}`) // 不显示错误提示
          },
        })
        this.bindClientEvent() // 绑定事件
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
                    this.$errorTips(`标记已读失败，error=${err}`)
                  })
              }
            })
            .catch(err => {
              this.$errorTips(`获取对话失败，error=${err}`)
            })
        }
      },
      toOrderDetail(name) {
        const orderId = name.match(/\d+/)
        if (orderId) {
          this.$router.push(`/orders/${orderId}`)
        }
      },
      onShowList() {
        if (!this.convList.length) return
        this.showList = !this.showList
      },
      fetchMessageList(options = {}) {
        const todayString = new Date().toDateString()
        const myClientId = `${this.user.account.id}`
        this.chat.imClient
          .getQuery()
          .limit(this.maxLimit)
          .withLastMessagesRefreshed(true)
          .containsMembers([myClientId])
          .find()
          .then(conversations => {
            const convList = []
            // 默认按每个对话的最后更新日期（收到最后一条消息的时间）倒序排列
            conversations.forEach(conv => {
              const otherMembers = []
              let defaultColor
              conv.members.forEach(member => { // 找出除了自己以外的用户
                const { _attributes: { attr: { username } } } = conv
                if (member !== myClientId && username && username[member]) {
                  if (!otherMembers.length) {
                    defaultColor = COLORS[member % 10]
                  }
                  otherMembers.push(username[member])
                }
              })
              if (defaultColor) { // 排除只有自己的对话
                const date = conv.lastMessageAt
                let formatTime
                if (date) {
                  if (todayString === date.toDateString()) { // 时间为今天内，显示时:分
                    formatTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
                  } else { // 时间为昨天以前，显示日期
                    formatTime = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
                  }
                }
                convList.push({
                  ...conv,
                  _showBtn: false, // 是否显示已读按钮
                  _formatTime: formatTime,
                  _otherMembers: otherMembers, // 除了自己以外的聊天用户
                  _defaultColor: defaultColor, // 头像颜色，取第一个用户id尾号
                  _unreadMessageCount: conv.unreadMessagesCount || 0,
                })
              }
            })
            if (options.success) {
              options.success(convList)
            }
          })
          .catch(err => {
            if (options.error) {
              options.error(err)
            }
          })
      },
      bindClientEvent() {
        const self = this
        this.clientEventMap = {
          [Event.MESSAGE]: (message) => {
            self.fetchMessageList({
              success: (convList) => {
                self.convList = convList
              },
            })
          },
          [Event.UNREAD_MESSAGES_COUNT_UPDATE]: (conversations) => {
            conversations.forEach(conv => {
              const findConv = self.convList.find(item => {
                return item.id === conv.id
              })
              if (findConv) {
                self.$set(findConv, '_unreadMessageCount', conv.unreadMessagesCount)
              }
            })
            self.$nuxt.$emit('IM.Event.UNREAD_MESSAGES_COUNT_UPDATE', conversations) // 发送全局事件
          },
        }
        Object.keys(this.clientEventMap).forEach(evtType => {
          this.chat.imClient.on(evtType, this.clientEventMap[evtType])
        })
      },
      unbindClientEvent() {
        if (this.chat.imClient) {
          Object.keys(this.clientEventMap).forEach(evtType => {
            this.chat.imClient.off(evtType)
          })
        }
      },
    },
  }
</script>

<style lang="scss">
  #chat-list-wrapper {
    .chat-list-btn {
      position: relative;
      width: 60px;
      height: 60px;
      line-height: 60px;
      background-color: #fff;
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
        color: #52cbca;
        font-size: 31px;
      }
      .chat-badge {
        position: absolute;
        height: 7px;
        width: 7px;
        border-radius: 50%;
        top: 18px;
        right: 20px;
        transform: translate3d(100%, -50%, 0);
        background-color: #e35555;
        border: solid 1px #fff;
        display: inline-block;
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
