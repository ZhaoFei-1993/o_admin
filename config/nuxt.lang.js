const webpack = require("webpack");
const path = require("path");
const marked = require('marked')
const renderer = new marked.Renderer();

module.exports = {
  /*
   ** Build configuration
   */
  build: {

    //publicPath: process.env.NODE_ENV === "pre"? "https://precdn.viabtc.com/static/": "https://cdn.viabtc.com/static/",
    filenames: {
      manifest: "manifest.[hash:7].js",
      css: "style.[chunkhash:7].css",
      vendor: "vendor.[chunkhash:7].js",
      app: "viabtc.[chunkhash:7].js",
      chunk: "[name].[chunkhash:7].js"
    },
    //vendor: ["babel-polyfill", "axios"],
    extend(config, ctx) {
      //spritesmith
      config.resolve = config.resolve || {
        modules: []
      };
      if (config.plugins.length > 1) {
        config.plugins = config.plugins.slice(0, 1);
      }

      config.module.rules.push({
        test: /\.md$/,
        use: [{
            loader: "html-loader"
          },
          {
            loader: "markdown-loader",
            options: {
              renderer: renderer,
              // highlight: function (code) {
              //   return require('highlight.js').highlightAuto(code).value;
              // }
            }
          }
        ]
      })

      //多语言自动替换
      config.module.rules.push({
        test: /\.vue$/,
        exclude: [
          /node_modules/,
          /\.nuxt/,
          /examples\//
        ],
        loader: "i18n-cn-autotrans-loader",
        enforce: "pre",
        options: {
          hashLength: 8,
          writeFile: true,
          repeatFlag: "\\[R\\]",
          root: "locales",
          prefix: "",
          upgradeLangs: false,
          originalLang: "zh_Hans_CN",
          targetLangs: ["zh_Hant_HK", "en_US"],
          deprecatedMark: '****DEPRECATED****',
          cacheTime: 5000
        }
      });
    }
  },

  plugins: []
};
