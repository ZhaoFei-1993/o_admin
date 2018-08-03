const devLogin = 'http://test2.coinex.com/account/signin/?redirect=' + encodeURIComponent('http://dev.admin.otc.coinex.com/');
const preLogin = 'http://test2.coinex.com/account/signin/?redirect=' + encodeURIComponent('http://test.admin.otc.coinex.com/');
const prodLogin = 'http://www.coinex.com/account/signin/?redirect=' + encodeURIComponent('http://admin_otc.coinex.com/');

const domains = {
  development: {
    serverHost: 'http://dev.admin.otc.coinex.com',
    clientHost: 'http://dev.admin.otc.coinex.com',
    loginURL: devLogin,
    apiPrefix: '/admin',
    webSocket: '',
    cdn: ''
  },
  production: {
    serverHost: 'https://admin_otc.coinex.com',
    clientHost: 'https://admin_otc.coinex.com',
    apiPrefix: '/admin',
    loginURL: prodLogin,
    webSocket: '',
    cdn: ''
  },
  pre: {
    serverHost: 'http://test.admin.otc.coinex.com',
    clientHost: 'http://test.admin.otc.coinex.com',
    loginURL: preLogin,
    apiPrefix: '/admin',
    webSocket: '',
    cdn: ''
  }
};
console.log('mode', process.env.MODE)
module.exports = domains[process.env.MODE] || domains.production;
