process.SERVER_BUILD = true
const {
  Nuxt,
  Builder
} = require('nuxt')

require("../plugins/logger")
const Koa = require('koa')

const app = new Koa()

console.log('server:', process.env.NODE_ENV)
console.log('MODE:', process.env.MODE)
let config = null
if (process.env.MODE === 'development') {
  config = require('../config/nuxt.dev.js')
} else if (process.env.MODE === 'pre') {
  config = require('../config/nuxt.pre.js')
} else {
  config = require('../config/nuxt.prd.js')
}

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 5008

if (process.env.MODE === 'development') { //本地开发
  const jsonServer = require('json-server'); // 基于express的
  const cookieParser = require('cookie-parser');
  const db = require('./mock/db');
  const middleware = require('./mock/middleware');
  const server = jsonServer.create();
  const router = jsonServer.router(db());
  const defaultMiddlewares = jsonServer.defaults();
  server.use(jsonServer.rewriter({
    '/api/admin/*': '/$1',
  }));
  server.use(cookieParser());
  server.use((req, res, next) => {
    return middleware(req, res, next);
  });
  router.render = (req, res) => {
    const length = res.locals.data.length
    // 转换成后端使用的数据结构
    res.jsonp({
      data: length ? {data: res.locals.data, total: res.locals.data.length} : res.locals.data,
      code: 0,
      message: 'ok',
    })
  }
  server.use(defaultMiddlewares);
  server.use(router);

  server.listen(4008, () => {
    console.log('JSON Server is running on localhost:4008')
  });
}

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev MODE
if (process.env.NODE_ENV !== 'production') {
  const builder = new Builder(nuxt)
  builder.build().catch(e => {
    console.error(e) // eslint-disable-line no-console
    process.exit(1)
  })

  app.use(async function (ctx, next) {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.info(`koa:render ${ctx.method} ${ctx.url} - ${ms}ms`)
  })
}

app.use(ctx => {
  ctx.status = 200 // koa defaults to 404 when it sees that status is unset
  return new Promise((resolve, reject) => {
    ctx.res.on('close', resolve)
    ctx.res.on('finish', resolve)
    try {
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        // but it's undefined when set router base without error.
        if (promise) {
          promise.then(resolve).catch(reject)
        } else {
          resolve();
        }
      });
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = err.message
      ctx.app.emit("error", err, ctx)
      console.error(err)
    }
  })
})

// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
