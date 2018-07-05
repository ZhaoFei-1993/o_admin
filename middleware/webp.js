export default function ({
  store,
  query,
  error,
  req,
  replace,
  hotReload
}) {
  // console.log('process.SERVER_BUILD', process.SERVER_BUILD)
  if (process.SERVER_BUILD) {
    var accept = req.headers["accept"]
    if (/html/i.test(accept) && /webp/i.test(accept)) {
      store.commit("webp", true)
    }
  }
}
