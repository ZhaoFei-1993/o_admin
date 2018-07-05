export const state = () => ({
  webp: false,
  errorText: null,
  successText: null,
  supportCoins: ['bch'],
  loggedIn: false,
  authorized: false,
  checkingAuth: false,
});

export const mutations = {
  webp(state, support) {
    state.webp = support;
  },
  errorText(state, text) {
    state.errorText = text;
  },
  successText(state, text) {
    state.successText = text;
  },
  sign(state, isIn) {
    state.loggedIn = isIn;
  },
  authorize(state, bool) {
    state.authorized = bool;
  },
  checkAuth(state, bool) {
    state.checkingAuth = bool;
  }
};

export const actions = {};
