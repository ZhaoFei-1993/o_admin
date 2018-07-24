export const state = () => ({
  account: null,
});

export const mutations = {
  SET_ACCOUNT(state, account) {
    state.account = account;
  },
};
export const getters = {
  isSuperAdmin: state => state.account.role === 'super_admin'
}
export const actions = {
  fetchUserAccount({commit}) {
    this.app.$axios.get('/user/account').then(response => {
      commit('SET_ACCOUNT', response.data.data)
    })
  },
  signOut({commit}) {
    this.$axios.post('/sign/out').then(response => {
      commit('SET_ACCOUNT', null)
      this.$router.push('/forbidden');
    });
  }
};
