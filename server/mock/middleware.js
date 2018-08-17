const request = require('request');
const faker = require('faker/locale/zh_CN');

module.exports = (req, res, next) => {
  // fake auth
  console.log(req.url);
  // 验证逻辑根据测试需要修改
  // if (!req.cookies || !req.cookies.token) {
  //   return res.sendStatus(401)
  // }
  if (req.url === '/verification' && req.method === 'GET') {
    return res.json({data: {}});
  }
  if (req.url === '/logout' && req.method === 'POST') {
    return res.json({data: {}});
  }

  if (req.url === '/me/balance') {
    const balances = [];
    for (let i = 0; i < 4; i++) {
      balances.push({
        id: faker.random.number(),
        coin_type: i, // 数字货币币种
        total: faker.random.number(),
        frozen: faker.random.number(),
        create_time: faker.date.past(),
        update_time: faker.date.past(),
      });
    }
    return res.json({
      code: 0,
      message: 'OK',
      data: {
        total: 4,
        data: balances,
      },
    });
  }
  if (req.url === '/me/balanceHistory') {
    const transactions = [];
    for (let i = 0; i < 10 + faker.random.number(); i++) {
      transactions.push({
        id: i,
        coin_type: faker.random.arrayElement([1, 2, 3, 4]), // 数字货币币种
        amount: faker.random.number(),
        business_type: faker.random.arrayElement([1, 2]),
        balance: faker.random.number(), // 余额
        create_time: faker.date.past(),
      });
    }
    return res.json({
      code: 0,
      message: 'OK',
      data: {
        total: transactions.length,
        data: transactions,
      },
    });
  }
  // 后端已经开发好的api就直接转发，没有开发好的就用本地json server
  const backendAPI = ['/posts'];
  for (const url of backendAPI) {
    if (req.url.indexOf(url) === 0) {
      // const redirected = 'http://jsonplaceholder.typicode.com' + req.url
      const redirected = 'http://admin.dev.otc.coinex.com/api' + req.url;
      return req.pipe(request(redirected)).pipe(res);
    }
  }
  req.query._page = req.query.page;
  req.query._limit = req.query.limit;
  req.query._start = req.query.start;
  req.query._end = req.query.end;
  return next();
};
