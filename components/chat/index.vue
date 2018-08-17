<template>
  <div class="chat" ref="chatWrapper" :style="{width: `${width}px`, height: `${height}px`}">
    <div class="content" ref="chatbox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="0" infinite-scroll-reverse infinite-scroll-immediate-check="false">
      <div v-for="item in msgLog" class="content-detail-box" :key="item.id">
        <div class="msg-time">
          {{ item._timestamp | formatTime }}
        </div>
        <template v-if="item.content._lctype === messageType.order">
          <div class="order-text">
            <template v-if="eachUserId">
              <template v-if="['appeal_create', 'appeal_cancel'].indexOf(item.content._lctext) > -1">
                {{ orderMessages[item.content._lctext].customer[item.from === eachUserId.buyer ? 'byBuyer' : 'bySeller'] }}
              </template>
              <template v-else>
                {{ orderMessages[item.content._lctext].customer }}
              </template>
            </template>
            <template v-else>
              <template v-if="item.content._lctext === 'order_create'">
                {{ isBuySide ? orderMessages[item.content._lctext].me : orderMessages[item.content._lctext].other }}
              </template>
              <template v-else>
                {{ item.from === clientId ? orderMessages[item.content._lctext].me : orderMessages[item.content._lctext].other }}
              </template>
            </template>
          </div>
        </template>
        <template v-else>
          <template v-if="item.from === clientId">
            <div class="msg-box-right">
              <div class="msg-detail-wrapper">
                <div class="msg-username username-right">{{ memberInfoMap[item.from].name }}</div>
                <div class="msg-username username-right" v-if="item.status === MessageStatus.FAILED">
                  <span class="msg-send-error"></span>
                  <span>发送失败</span>
                </div>
                <div class="msg-text my-text">
                  <span v-if="item.content._lctype === messageType.text">{{ item.content._lctext }}</span>
                  <img v-else-if="item.content._lctype === messageType.image" @click="onClickImage(item.content._lcfile.url)" style="width: 100%" :src="item.content._lcfile.url">
                  <span v-else-if="item.content._lctype === messageType.auto">{{ item.content._lctext }}</span>
                  <span v-else>[不支持当前消息类型]</span>
                </div>
              </div>
              <UserAvatar v-if="memberInfoMap[item.from]" :username="memberInfoMap[item.from].name" :color="memberInfoMap[item.from].color" :online="false" :size="30"></UserAvatar>
            </div>
          </template>
          <template v-else-if="item.from === 'temporary'">
            <div class="begin-text-wrapper">
              <div class="begin-text">{{ item.content._lctext }}</div>
            </div>
          </template>
          <template v-else>
            <div class="msg-box-left">
              <UserAvatar v-if="memberInfoMap[item.from]" :username="memberInfoMap[item.from].name" :color="memberInfoMap[item.from].color" :online="false" :size="30"></UserAvatar>
              <div class="msg-detail-wrapper">
                <div class="msg-username username-left">{{ memberInfoMap[item.from].name }}</div>
                <div class="msg-username username-left" v-if="item.status === MessageStatus.FAILED">
                  <span class="msg-send-error"></span>
                  <span>发送失败</span>
                </div>
                <div class="msg-text">
                  <span v-if="item.content._lctype === messageType.text">{{ item.content._lctext }}</span>
                  <img v-else-if="item.content._lctype === messageType.image" @click="onClickImage(item.content._lcfile.url)" style="width: 100%" :src="item.content._lcfile.url">
                  <span v-else-if="item.content._lctype === messageType.auto">{{ item.content._lctext }}</span>
                  <span v-else>[不支持当前消息类型]</span>
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
    <div class="input-box" :style="{height: `${inputHeight}px`}">
      <div class="input-group">
        <input placeholder="输入信息，回车发送" type="text" class="input-text" v-model="message" @keyup.enter="onSendMsg">
        <input id="chat-file-image" type="file" accept="image/*" style="display: none;" ref="fileSelector" @change="onUpload">
        <button id="upload" @click="onSelectFile">
          <span style="color: #52cbca;"><i class="iconfont icon-attachment"></i></span>
        </button>
      </div>
    </div>
    <image-modal v-model="imageModalData.show" :src="imageModalData.src"></image-modal>
  </div>
</template>

<script>
  import { TextMessage, Event, MessageStatus } from 'leancloud-realtime'
  import AV from 'leancloud-storage'
  import { ImageMessage } from 'leancloud-realtime-plugin-typed-messages'
  import UserAvatar from './avatar'
  import ImageModal from './image-modal'
  import infiniteScroll from './infinite-scroll-directive.js'
  import $toast from './toast.js'
  import { COLORS, MESSAGE_TYPE, ORDER_MESSAGES } from './constant.js'

  export default {
    data() {
      return {
        orderMessages: ORDER_MESSAGES,
        messageType: MESSAGE_TYPE,
        MessageStatus,
        imageModalData: {
          show: false,
          src: '',
        },
        colors: COLORS,
        members: [],
        message: '',
        conversation: null,
        limit: 20, // 每次拉取历史记录条数
        messageIterator: null,
        msgLog: [],
        loading: false, // 消息加载中
        loadAll: false, // 是否已经加载全部消息
        memberInfoMap: {}, // 保存聊天者信息：头像色号，用户名
        originalTitle: '', // 保存旧页面title
        unreadMessagesCount: 0, // 未读消息数
        clientEventMap: {}, // 客户端级别事件
        convEventMap: {}, // 对话级别事件
        restartCount: 0, // 初始化遇到错误尝试重新初始化次数
      }
    },
    directives: {
      infiniteScroll, // 无限load指令
    },
    props: {
      isBuySide: {
        type: Boolean,
        default: false,
      },
      client: {
        type: Object,
      },
      conversationId: {
        required: true,
        type: String,
      },
      clientId: {
        required: true,
        type: String,
      },
      eachUserId: { // 买、卖和客服三方用户id，只有在admin端使用才需要传入
        required: false,
        type: Object,
        default: null,
      },
      width: {
        type: Number,
        default: 400,
      },
      height: {
        type: Number,
        default: 480,
      },
      inputHeight: { // 输入框高度
        type: Number,
        default: 45,
      },
    },
    components: {
      UserAvatar,
      ImageModal,
    },
    watch: {
      unreadMessagesCount(count) {
        const countText = count ? `(${count}) ` : ''
        window.document.title = `${countText}${this.originalTitle}`
      },
      client() {
        this.init()
      },
      conversationId(newVal, oldVal) { // 异步获取对话id
        if (!oldVal && newVal) {
          this.init()
        }
      },
    },
    beforeDestroy() {
      if (this.client) {
        Object.keys(this.clientEventMap).forEach(evtType => {
          this.client.off(evtType)
        })
      }
      if (this.conversation) {
        Object.keys(this.convEventMap).forEach(evtType => {
          this.conversation.off(evtType)
        })
        this.conversation = null
        this.messageIterator = null
      }
      window.document.removeEventListener('visibilitychange', this.handleVisibilityChange)
      window.document.title = this.originalTitle // 还原title
      this.$nuxt.$off('IM.Event.UNREAD_MESSAGES_COUNT_UPDATE')
    },
    mounted() {
      this.init()
      $toast.init(this.$refs.chatWrapper) // 初始化toast
      this.originalTitle = window.document.title
      this.$nuxt.$on('IM.Event.UNREAD_MESSAGES_COUNT_UPDATE', conversations => {
        const conv = conversations.find(item => {
          return item.id === this.conversationId
        })
        if (conv) {
          this.unreadMessagesCount = conv.unreadMessagesCount
        }
      })
    },
    methods: {
      init() { // 全部功能初始化
        const { client, conversationId } = this
        if (!client) return
        if (!conversationId) return

        client
          .getConversation(conversationId)
          .then(conversation => {
            if (conversation) {
              this.conversation = conversation
              this.unreadMessagesCount = this.conversation.unreadMessagesCount
              this.members = this.conversation.members
              this.messageIterator = this.conversation.createMessagesIterator({
                limit: this.limit,
              })
              this.initMsgLog() // 初始化聊天记录
              this.restartCount = 1000
            } else {
              return Promise.reject(new Error(`getConversation error, conversation=${conversation}`))
            }
          })
          .catch(err => {
            const maxRestartCount = 3 // 最多重新初始化次数
            this.restartCount += 1
            console.error(this.restartCount, err)
            if (this.restartCount < maxRestartCount) {
              const tid = setTimeout(() => {
                clearTimeout(tid)
                this.init()
              }, 1000)
            }
          })
      },
      handleVisibilityChange() { // 监听页面隐藏事件，取消未读
        if (!window.document.hidden) {
          this.conversation.read()
          this.unreadMessagesCount = 0
        }
      },
      onJoin() { // 主动加入群聊
        this.conversation.join().then(conversation => {
          this.members = conversation.members
        }).catch(console.error.bind(console))
      },
      onLeave() { // 主动退出群聊
        this.conversation.quit().then(conversation => {
          this.members = conversation.members
        }).catch(console.error.bind(console))
      },
      pushSystemMessage(text) { // 添加系统临时消息，不会保存到服务器，暂时支持纯文字
        this.msgLog.push({
          id: `temporary_${Date.now()}`, // 消息id
          from: 'temporary',
          content: {
            _lctext: text,
            _lctype: this.messageType.text,
          },
          _timestamp: Date.now(),
        })
      },
      onClickImage(src) {
        this.imageModalData.src = src
        this.imageModalData.show = true
      },
      onUpload(evt) {
        const file = evt.target.files[0]
        if (!file) return
        if (file.size > 5000000) {
          this.$refs.fileSelector.value = '' // 需要重置dom
          $toast.show('单文件不可超过5M', 1500)
          return
        }
        if (file.name && this.conversation) {
          $toast.show('发送中...0%')
          const fileObj = new AV.File(file.name, file)
          fileObj.save({
            onprogress(e) {
              $toast.show(`发送中...${Math.round(e.percent)}%`)
            },
          }).then(savedFile => {
            const message = new ImageMessage(savedFile)
            return this.conversation.send(message)
          }).then((message) => {
            this.$nuxt.$emit('IM.Event.SINGLE_MESSAGE_UPDATE', message)
            $toast.show('发送成功...100%', 1000)
            this.messageHandler({
              ...message,
              content: { // leancloud返回字段content=undefined，需要自己构造
                _lcfile: message._lcfile,
                _lctype: message.type,
              },
            })
          }).catch(err => {
            $toast.show(`发送失败 ${err}`, 1500)
          })
        }
      },
      onSelectFile() {
        this.$refs.fileSelector.click()
      },
      messageHandler(msg) {
        this.msgLog = this.msgLog.concat(this.memberInfoMapper([msg]))
        this.scrollToBottom()
        if (!window.document.hidden) {
          this.conversation.read()
        }
      },
      memberInfoMapper(arr) { // 遍历每一个消息，对用户头像进行映射，以防部分已退出用户没有头像
        const { conversation } = this
        if (conversation) {
          const { _attributes: { attr: { username } } } = conversation
          arr.forEach(item => {
            if (!this.memberInfoMap[item.from]) {
              this.memberInfoMap[item.from] = {
                color: this.colors[item.from % 10],
                name: !!username && !!username[item.from] ? username[item.from] : '',
              }
            }
          })
        }
        return arr
      },
      initMsgLog() {
        this.messageIterator.next().then((res) => {
          if (res.value) {
            this.msgLog = this.memberInfoMapper(res.value).concat(this.msgLog)
            this.pushSystemMessage('现在可以开始聊天')
            this.scrollToBottom() // 滚动到底部
            this.conversation.read() // 对话标记为已读
          }
          const tid = setTimeout(() => {
            this.bindClientEvent() // 需要初始化聊天记录后才能绑定事件，否则会出现重复消息问题
            this.bindConversationEvent() // 完成初始化后才绑定对话级别事件
            clearTimeout(tid)
          })
        })
      },
      bindClientEvent() {
        const self = this
        this.clientEventMap = {
          [Event.DISCONNECT]: () => {
            $toast.show('连接已断开')
          },
          [Event.OFFLINE]: () => {
            $toast.show('网络不可用，请检查网络设置')
          },
          [Event.ONLINE]: () => {
            $toast.show('网络已恢复', 1500)
          },
          [Event.SCHEDULE]: (attempt, time) => {
            $toast.show(`${time / 1000}s 后进行第 ${attempt + 1} 次重连`)
          },
          [Event.RETRY]: (attempt) => {
            $toast.show(`正在进行第 ${attempt + 1} 次重连`)
          },
          [Event.RECONNECT]: () => {
            self.conversation.join()
          },
          [Event.RECONNECT_ERROR]: () => {
            $toast.show('重连失败，请刷新页面重试')
          },
        }
        Object.keys(this.clientEventMap).forEach(evtType => {
          this.client.on(evtType, this.clientEventMap[evtType])
        })
        window.document.addEventListener('visibilitychange', this.handleVisibilityChange)
      },
      bindConversationEvent() {
        const self = this
        this.convEventMap = {
          [Event.MESSAGE]: (message) => {
            self.messageHandler(message)
          },
          [Event.MEMBERS_JOINED]: (payload) => { // 有用户被添加至某个对话
            self.pushSystemMessage(`${payload.invitedBy === 'REST_API' ? '客服' : payload.invitedBy}已加入对话`)
          },
          [Event.MEMBERS_LEFT]: (payload) => { // 有成员被从某个对话中移除
            self.pushSystemMessage(`${payload.kickedBy === 'REST_API' ? '客服' : payload.kickedBy}已退出对话`)
          },
          [Event.KICKED]: (payload) => { // 当前用户被从某个对话中移除
            if (payload.kickedBy === 'REST_API') return // 系统邀请信息不展示
            self.pushSystemMessage(`${payload.kickedBy} 将你移出对话`)
          },
        }
        Object.keys(this.convEventMap).forEach(evtType => {
          this.conversation.on(evtType, this.convEventMap[evtType])
        })
      },
      loadMore() {
        if (!this.loading && this.messageIterator && !this.loadAll) {
          this.loading = true
          const oldTarget = this.$refs.chatbox
          let oldScrollHeight = 0
          if (oldTarget) {
            oldScrollHeight = oldTarget.scrollHeight // 保存旧scrollHeight数据
          }
          this.messageIterator.next().then((res) => {
            this.loading = false
            this.loadAll = res.done
            if (res.value) {
              this.msgLog = this.memberInfoMapper(res.value).concat(this.msgLog)
              this.$nextTick(() => {
                const target = this.$refs.chatbox
                if (target) {
                  target.scrollTop = target.scrollTop + (target.scrollHeight - oldScrollHeight) // 新的滚动高度 = 新高度 - 旧高度
                }
              })
            }
          })
        }
      },
      onSendMsg() {
        const msg = this.message.trim()
        if (msg && this.conversation) {
          this.conversation.send(new TextMessage(msg)).then(message => {
            this.$nuxt.$emit('IM.Event.SINGLE_MESSAGE_UPDATE', message) // 手动强制更新聊天列表
            this.messageHandler({
              ...message,
              content: { // leancloud返回字段content=undefined，需要自己补充
                _lctext: message._lctext,
                _lctype: message.type,
              },
            })
          }).catch(err => {
            console.error(err)
            $toast.show(`发送失败: ${err}`, 1500)
          })
          this.message = ''
        }
      },
      scrollToBottom() {
        const tid = setTimeout(() => {
          const target = this.$refs.chatbox
          if (target) {
            target.scrollTop = target.scrollHeight
          }
          clearTimeout(tid)
        }, 150)
      },
    },
    filters: {
      formatTime(timestamp) {
        const todayString = new Date().toDateString()
        const date = new Date(timestamp)
        let formatTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
        if (todayString !== date.toDateString()) {
          formatTime = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${formatTime}`
        }
        return formatTime
      },
    },
  }
</script>

<style lang="scss">
  .chat {
    background-color: #fff;
    margin: 0 auto;
    position: relative;
    display: flex;
    flex-direction: column;
    .title {
      position: relative;
      width: 100%;
      height: 30px;
      background-color: #ccc;
      height: 30px;
      line-height: 30px;
      text-align: center;
    }
    .content {
      overflow-y: auto;
      overflow-x: hidden;
      flex: 10;
      padding: 10px 30px;
      .content-detail-box {
        margin-bottom: 20px;
        .order-text {
          width: 100%;
          color: #192330;
          text-align: center;
          overflow: hidden;
        }
      }
      .begin-text-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        .begin-text {
          display: inline-block;
          text-align: center;
          font-size: 12px;
          color: #9b9b9b;
          width: auto;
          height: auto;
          line-height: 22px;
          background-color: rgba(221, 221, 221, .32);
          margin: 10px auto;
          border-radius: 15px;
          padding: 0 10px;
        }
      }
      .msg-username {
        font-size: 12px;
        color: #9b9b9b;
        .msg-send-error {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABfElEQVQ4T6WTPUtCYRTHz/9qVJC21CxeCzRuQyBIU98hoqGCEJqiTShuhRmRVkRrLYWEDQ1+iKboBRrUFLKr7S3a0Av6nLjXF7yppXS25znn/Dj/8wL6p6FVftqhTgoLTTHBq/tBfC+V6crzErn+GW8CpIZDA8L2dQzQQiswM8V6iqVl9+vBW81fBzyNhOwf4vMGgPs3Vcyc6ZN6faPZULFSXdWSshonYNqczI+VN8Ya/5n5YlyLGFUagIS84QX4rkmfELNEEliiS5OPSViEcHnye3kDkJTVbQKCHQP0QOaAokWOKgCXGiXCYpeAU0WLLFUlqGcA/E0AppAgAkBbTY1liipa2G8AUs71AEt02NVOCdpRcuGgAcg4Np0li8gSSGqEoF0T9SABn5Lbva2PMSGrMQDznYyRmOKKFp4x7cGzvDb4Dou+qp4/pKT7uTzp0vYLJoAhZWjVVrJbTwg01wZybi2UVlqucmNC7ZgEMKH/S8wPHR1TV1OoBn8Dv26REZSgcFEAAAAASUVORK5CYII=);
          vertical-align: sub;
          display: inline-block;
          width: 16px;
          height: 16px;
        }
      }
      .msg-time {
        text-align: center;
        color: #9b9b9b;
        font-size: 12px;
        height: 24px;
        line-height: 24px;
      }
      .msg-box-left {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 20px;
        .msg-detail-wrapper {
          padding-left: 10px;
          .username-left {
            text-align: left;
          }
          .msg-text {
            position: relative;
            margin-top: 7px;
            float: left;
            max-width: 285px;
            padding: 15px 15px 15px 20px;
            border-radius: 4px;
            word-wrap: break-word;
            background-color: #f9f9f9;
            color: #27313e;
            &::after {
              content: "";
              position: absolute;
              display: block;
              border-style: solid;
              border-color: #f9f9f9 transparent transparent;
              border-right-color: #f9f9f9;
              border-width: 8px;
              border-left-color: transparent;
              border-left-width: 0;
              border-top-color: transparent;
              margin: -8px 0 0;
              top: 15px;
              left: -8px;
              right: auto;
              bottom: auto;
            }
          }
        }
      }
      .msg-box-right {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
        .msg-detail-wrapper {
          padding-right: 10px;
          .username-right {
            text-align: right;
          }
          .my-text {
            background-color: #b8e986;
          }
          .msg-text {
            position: relative;
            margin-top: 7px;
            float: right;
            max-width: 285px;
            padding: 15px 20px 15px 15px;
            border-radius: 4px;
            word-wrap: break-word;
            color: #27313e;
            &::after {
              content: "";
              position: absolute;
              display: block;
              border-style: solid;
              border-color: #b8e986 transparent transparent;
              border-left-color: #b8e986;
              border-width: 8px;
              border-right-color: transparent;
              border-right-width: 0;
              border-top-color: transparent;
              margin: -8px 0 0;
              top: 15px;
              right: -8px;
              left: auto;
              bottom: auto;
            }
          }
        }
      }
    }
    .input-box {
      width: 100%;
      .input-group {
        height: 100%;
        border-top: solid 1px #ddd;
      }
      .input-text {
        height: 100%;
        border: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        position: relative;
        flex: 1 1 auto;
        width: 1%;
        margin-bottom: 0;
        padding-left: 30px;
        font-size: 16px;
        outline: none;
      }
      #upload {
        display: inline-block;
        padding: 0 10px;
        outline: none;
        cursor: pointer;
        background-color: #fff;
        border: 0;
      }
    }
  }
</style>
