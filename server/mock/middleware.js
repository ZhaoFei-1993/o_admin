const request = require('request')
module.exports = (req, res, next) => {
  // fake auth
  console.log(req.cookies);
  if (!req.cookies || !req.cookies.token) { // 验证
    return res.sendStatus(401);
  }
  if (req.url === '/verification' && req.method === 'GET') {
    return res.json({data: {}});
  }
  if (req.url === '/logout' && req.method === 'POST') {
    return res.json({data: {}});
  }
  // 后端已经开发好的api就直接转发，没有开发好的就用本地json server
  const backendAPI = ['/posts']
  for (let url of backendAPI) {
    if (req.url.indexOf(url) === 0) {
      // const redirected = 'http://jsonplaceholder.typicode.com' + req.url
      const redirected = 'http://dev.otc.coinex.com/api' + req.url
      return req.pipe(request(redirected)).pipe(res)
    }
  }
  // 转换成后端使用的数据结构
  const transformedData = {
    'code': (res.status >= 200 && res.status < 300) ? 0 : res.status,
    'message': 'OK',
    'data': res.data && res.data.length ? {
      total: res.headers['x-total-count'] || 1000,
      data: res.data,
    } : res.data,
  }
  res.data = transformedData
  req.query._page = req.query.page;
  req.query._limit = req.query.limit;
  req.query._start = req.query.start;
  req.query._end = req.query.end;
  console.log(req.url);
  return next();
};
