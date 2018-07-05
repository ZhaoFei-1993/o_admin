const devLogin = 'http://dev.viabtc.com:8091/signin/?next=' + encodeURIComponent('http://admin.mall-dev.viabtc.com/');
const prodLogin = 'http://pool.viabtc.com/signin/?next=' + encodeURIComponent('http://admin.mall.viabtc.com/');
const devPoolAdmin = 'http://dev.viabtc.com:8091';
const prodPoolAdmin = 'http://pool.viabtc.com';

const domains = {
  development: {
    serverHost: 'http://local-admin.viabtc.com',
    clientHost: 'http://local-admin.viabtc.com',
    loginURL: 'http://dev.viabtc.com:8091/signin/?next=' + encodeURIComponent('http://local-admin.viabtc.com/'),
    apiPrefix: '/api/admin',
    poolAdmin: devPoolAdmin,
    webSocket: '',
    cdn: ''
  },
  production: {
    serverHost: 'http://admin.mall.viabtc.com',
    clientHost: 'http://admin.mall.viabtc.com',
    apiPrefix: '/api/admin',
    loginURL: prodLogin,
    poolAdmin: prodPoolAdmin,
    webSocket: '',
    cdn: ''
  },
  pre: {
    serverHost: 'http://admin.mall-dev.viabtc.com',
    clientHost: 'http://admin.mall-dev.viabtc.com',
    loginURL: devLogin,
    poolAdmin: devPoolAdmin,
    apiPrefix: '/api/admin',
    webSocket: '',
    cdn: ''
  }
};
console.log('mode', process.env.MODE)
module.exports = domains[process.env.MODE] || domains.production;
