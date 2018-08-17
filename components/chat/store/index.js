import {Realtime} from 'leancloud-realtime';
import AV from 'leancloud-storage';

const MODE = process.env.MODE || 'production';
let APP_ID = 'g5gV4s1vKQPtaYNt5HYRQQ6P-9Nh9j0Va'; // 测试key
let APP_KEY = 'sxODuFunEwnJnDBbou5qRztq';
if (MODE === 'production') {
  APP_ID = '1Ch6IpbK75YsWl5G9GEjY1yQ-9Nh9j0Va'; // 正式key
  APP_KEY = '7deykcLx2AKsaxdiuT68xlV1';
}
export const state = () => ({
  imClient: null, // leancloud实时通讯实例
});

export const mutations = {
  INIT_CHAT_CLIENT(state, data) {
    if (!state.imClient) {
      AV.init(APP_ID, APP_KEY); // 初始化leancloud云存储
      state.imClient = data;
    }
  },
};

export const actions = {
  newChatClient({commit, state}, clientId) {
    if (!state.imClient) {
      const realtime = new Realtime({
        appId: APP_ID,
        appKey: APP_KEY,
      });
      const self = this;
      return realtime.createIMClient(clientId, {
        signatureFactory() {
          return self.app.$axios.get('/system/leancloud/sign', {
            params: {
              sign_type: 'signin',
            }
          }).then(res => {
            if (res.data.code === 0) {
              return res.data.data;
            }
          });
        },
      }).then(myClient => {
        commit('INIT_CHAT_CLIENT', myClient);
        return Promise.resolve(myClient);
      }).catch(err => {
        return Promise.reject(err);
      });
    }
    return state.imClient;
  },

  logout({state}) {
    return state.imClient.close();
  },
};

export const getters = {};
