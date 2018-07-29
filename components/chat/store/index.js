import {Realtime} from 'leancloud-realtime'
import AV from 'leancloud-storage'


const APP_ID = 'OibOYNHFsWoqChdhAlebT7rS-gzGzoHsz'
const APP_KEY = 'IEIfsx2I6LkRajvtP2jcoCIW'

export const state =()=>({
  imClient: null, // leancloud实时通讯实例
})

export const mutations = {
  INIT_CHAT_CLIENT(state, data) {
    if (!state.imClient) {
      AV.init(APP_ID, APP_KEY) // 初始化leancloud云存储
      state.imClient = data
    }
  },
}

export const actions = {
  newChatClient({commit, state}, clientId) {
    if (!state.imClient) {
      const realtime = new Realtime({
        appId: APP_ID,
        appKey: APP_KEY,
      })
      const self = this
      return realtime.createIMClient(clientId, {
        signatureFactory() {
          return self.app.$axios.get('/system/leancloud/sign', {
            sign_type: 'signin',
          }).then(res => {
            if (res.code === 0) {
              return res.data
            }
          })
        },
      }).then(myClient => {
        commit('INIT_CHAT_CLIENT', myClient)
        return Promise.resolve(myClient)
      }).catch(err => {
        return Promise.reject(err)
      })
    }
    return state.imClient
  },

  logout({state}) {
    return state.imClient.close()
  },
}

export const getters = {}