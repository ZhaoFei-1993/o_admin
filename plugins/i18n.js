import Vue from "vue"
import cookies from "~/plugins/cookies"
import {getFormattedLang} from "../common/utilities";

export default ({
  app,
  store,
  isClient
}) => {
  if (isClient) {
    const search = window.location.search || ''
    const matches = search.replace('?', '').split('&')
    for (let i = 0; i < matches.length; i++) {
      if (/^lang=/.test(matches[i])) {
        const lang = matches[i].replace(/^lang=/, '');
        if (lang) {
          const formattedLang = getFormattedLang(lang);
          let expire = new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000))
          cookies.setItem(window.document, "lang", formattedLang, expire, "/")
        }
      }
    }
  }

  Vue.prototype.$t = function (key, lang) {
    const state = store.state.locale;
    const keys = key.split(".");
    const postFix = (lang || state.lang || "en") + ".json";

    const context = require.context("~/locales", true, /\.json$/);
    let value = context("./" + postFix);

    let folder = ".";
    keys.forEach((k, index) => {
      if (k) {
        value = value[k]

        if (index < keys.length - 1) {
          folder += "/" + k
        }
        //如果没有value，则读文件夹
        if (!value) {
          try {
            let dep = context(folder + "/" + postFix)
            if (dep) {
              value = dep[k] || "";
              //最后一位
              if (index === keys.length - 1) {
                if (!value) {
                  //取出下划线，首字母大写
                  value = k.replace(/_/g, " ").replace(/^(\w)/i, function ($1) {
                    return $1.toLocaleUpperCase()
                  })
                }
              } else {
                value = dep
              }
            } else {
              value = k.replace(/_/g, " ").replace(/^(\w)/i, function ($1) {
                return $1.toLocaleUpperCase()
              })
            }
          } catch (e) {
            //直接等於k值
            value = k.replace(/_/g, " ").replace(/^(\w)/i, function ($1) {
              return $1.toLocaleUpperCase()
            })
          }
        }
      }
    })
    return value
  }
  app.$t = Vue.prototype.$t;
  return app.$t
}
