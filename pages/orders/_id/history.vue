<template>
  <el-popover
    v-model="popoverVisible"
    @hide="hidePopover"
    @show="showPopover"
    placement="right"
    width="400"
    trigger="click">
    <div ref="chatLogBox" class="chat-log-box" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="0" infinite-scroll-reverse infinite-scroll-immediate-check="false">
      <div v-for="item in chatLogs">
        <span>{{ item.timestamp | formatDate }}</span>
        <el-tag type="success" size="mini" v-if="item._side === '买家'">{{ item._side }}</el-tag>
        <el-tag type="danger" size="mini" v-else-if="item._side === '卖家'">{{ item._side }}</el-tag>
        <el-tag type="warning" size="mini" v-else-if="item._side === '客服'">{{ item._side }}</el-tag>
        <el-popover
          v-if="item.data._lctype === messageType.image"
          placement="top-start"
          title="图片"
          width="450"
          trigger="hover"
          content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
          <img :src="item.data._lcfile.url" style="width: 100%;">
          <span slot="reference">【查看图片】</span>
        </el-popover>
        <span v-else>{{ item._text }}</span>
      </div>
    </div>
    <el-button type="primary" slot="reference" :disabled="popoverVisible">
      查看聊天记录
    </el-button>
  </el-popover>
</template>

<script>
  import { MESSAGE_TYPE, ORDER_MESSAGES } from '~/components/chat/constant.js';
  import infiniteScroll from '~/components/chat/infinite-scroll-directive.js';

  export default {
    data() {
      return {
        popoverVisible: false,
        messageType: MESSAGE_TYPE,
        orderMessages: ORDER_MESSAGES,
        loading: false,
        chatLogs: [],
        queryParams: {
          limit: 20,
          msgid: null,
          timestamp: null,
        },
        loadedAll: false,
      };
    },
    directives: {
      infiniteScroll,
    },
    props: ['id', 'order'],
    filters: {
      formatDate(timestamp) {
        const todayString = new Date().toDateString()
        const date = new Date(timestamp)
        let formatTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
        if (todayString !== date.toDateString()) {
          formatTime = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${formatTime}`
        }
        return formatTime
      },
    },
    methods: {
      hidePopover() {
        this.chatLogs = [];
        this.queryParams = {
          ...this.queryParams,
          msgid: null,
          timestamp: null,
        };
      },
      showPopover() {
        this.getChatLog(false);
      },
      scrollToBottom() {
        const tid = setTimeout(() => {
          const target = this.$refs.chatLogBox
          if (target) {
            target.scrollTop = target.scrollHeight
          }
          clearTimeout(tid)
        }, 150)
      },
      loadMore() {
        if (this.loadedAll) return;
        if (this.chatLogs.length) {
          this.queryParams = {
            ...this.queryParams,
            msgid: this.chatLogs[0]['msg-id'],
            timestamp: this.chatLogs[0].timestamp,
          };
        }
        this.getChatLog(true);
      },
      getChatLog(isLoadMore) {
        if (this.loading) return;
        this.loading = true;
        let oldTarget
        let oldScrollHeight = 0
        if (isLoadMore) {
          oldTarget = this.$refs.chatLogBox
          if (oldTarget) {
            oldScrollHeight = oldTarget.scrollHeight // 保存旧scrollHeight数据
          }
        }
        this.$axios.get(`orders/${this.id}/message`, {
          params: this.queryParams,
        }).then(res => {
          this.loading = false;
          if (res.data.data) {
            this.loadedAll = !res.data.data.length;
            this.chatLogs = res.data.data.map(item => {
              const msg = JSON.parse(item.data);
              const isBuyer = `${this.order.buy_user.id}` === item.from;
              const isSeller = `${this.order.sell_user.id}` === item.from;
              let side = '客服';
              let text = msg._lctext;
              side = isBuyer ? '买家' : side;
              side = isSeller ? '卖家' : side;
              if (msg._lctype === this.messageType.order) {
                text = this.orderMessages[msg._lctext].me;
              }
              return {
                ...item,
                data: msg,
                _text: text,
                _side: side,
              };
            }).reverse().concat(this.chatLogs);
            if (!isLoadMore) {
              this.scrollToBottom();
            } else {
              this.$nextTick(() => {
                const target = this.$refs.chatLogBox
                if (target) {
                  target.scrollTop = target.scrollTop + (target.scrollHeight - oldScrollHeight) // 新的滚动高度 = 新高度 - 旧高度
                }
              })
            }
          }
        }).catch(err => {
          console.error(err);
          this.loading = false;
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .chat-log-box {
    height: 390px;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;
  }
</style>
