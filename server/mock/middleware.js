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
  req.query._page = req.query.page;
  req.query._limit = req.query.limit;
  req.query._start = req.query.start;
  req.query._end = req.query.end;
  console.log(req.url);
  return next();
};
