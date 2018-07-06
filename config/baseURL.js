const devLogin = 'http://dev.coinex.com/account/signin/?next=' + encodeURIComponent('http://admin.otc-dev.coinex.com/');
const prodLogin = 'http://www.coinex.com/account/signin/?next=' + encodeURIComponent('http://admin.otc.coinex.com/');

const domains = {
  development: {
    serverHost: 'http://local-otc-admin.coinex.com',
    clientHost: 'http://local-otc-admin.coinex.com',
    loginURL: 'http://dev.coinex.com/account/signin/?next=' + encodeURIComponent('http://local-otc-admin.coinex.com/'),
    apiPrefix: '/api/admin',
    webSocket: '',
    cdn: ''
  },
  production: {
    serverHost: 'http://admin.otc.coinex.com',
    clientHost: 'http://admin.otc.coinex.com',
    apiPrefix: '/api/admin',
    loginURL: prodLogin,
    webSocket: '',
    cdn: ''
  },
  pre: {
    serverHost: 'http://admin.otc-dev.coinex.com',
    clientHost: 'http://admin.otc-dev.coinex.com',
    loginURL: devLogin,
    apiPrefix: '/api/admin',
    webSocket: '',
    cdn: ''
  }
};
console.log('mode', process.env.MODE)
module.exports = domains[process.env.MODE] || domains.production;
