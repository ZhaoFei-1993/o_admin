export const state = () => ({
  account: null,
});

export const mutations = {
  SET_ACCOUNT(state, account) {
    state.account = account;
  },
};
export const getters = {
  isSuperAdmin: state => state.account && state.account.role === 'super_admin'
}
export const actions = {
  fetchUserAccount({commit}) {
    return this.app.$axios.get('/users/account').then(response => {
      commit('SET_ACCOUNT', response.data.data)
    })
  },
  signOut({commit}) {
    return this.$axios.post('/sign/out').then(response => {
      commit('SET_ACCOUNT', null)
      this.$router.push('/forbidden');
    });
  }
};
