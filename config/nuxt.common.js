const baseDomain = require("./baseURL");
const webpack = require('webpack');
const SpritesmithPlugin = require("webpack-spritesmith");
const path = require("path");
const marked = require('marked');
const renderer = new marked.Renderer();

module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: 'CoinEx OTC - Admin',
    meta: [{
      charset: 'utf-8'
    }, {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }, {
      renderer: "webkit"
    }, {
      name: "format-detection",
      content: "telephone=no"
    }, {
      "http-equiv": 'X-UA-Compatible',
      content: 'IE=edge'
    }, {
      hid: "description",
      name: "description",
      content: ""
    }, {
      hid: "keywords",
      name: "keywords",
      content: ""
    }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }, {
      rel: 'stylesheet',
      type: 'text/css',
      href: '//at.alicdn.com/t/font_702301_2w5dkkdoc19bpgb9.css'
    }]
  },
  render: {
    gzip: true
  },

  router: {
    base: '/',
    middleware: ["i18n", "webp"],
  },

  /*
   ** Global CSS
   */
  css: [
    'quill/dist/quill.core.css',
    {
      src: "~/assets/style/global.scss",
      lang: "scss"
    },
    'element-ui/lib/theme-chalk/reset.css',
    'element-ui/lib/theme-chalk/index.css',
    {
      src: "~/assets/style/announcement.scss",
      lang: "scss"
    },
  ],

  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#3B8070'
  },
  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    filenames: {
      manifest: "manifest.[hash:7].js",
      css: "style.[hash:7].css",
      vendor: "vendor.[chunkhash:7].js",
      app: "otc.coinex.[chunkhash:7].js",
      chunk: "[name].[chunkhash:7].js"
    },
    vendor: ["babel-polyfill"],
    plugins: [
      new SpritesmithPlugin({
        src: {
          cwd: path.resolve(__dirname, "../assets/img/concat"),
          glob: "**/*.png"
        },
        target: {
          image: path.resolve(__dirname, "../assets/spritesmith/sprite.png"),
          css: path.resolve(__dirname, "../assets/spritesmith/sprite.scss")
        },
        retina: "@2x",
        apiOptions: {
          cssImageRef: "~assets/spritesmith/sprite.png"
        }
      })
    ],
    /*
     ** Run ESLint on save
     */
    extend(config, ctx) {
      // console.log('ctx', ctx)
      // resolve
      config.resolve = config.resolve || {
        modules: []
      };
      config.resolve.modules.push("spritesmith-generated");

      config.module.rules.push({
        test: /\.md$/,
        use: [{
          loader: "html-loader"
        }, {
          loader: "markdown-loader",
          options: {
            renderer: renderer,
          }
        }]
      });
      const urlLoader = config.module.rules.find((rule) => rule.loader === 'url-loader');
      urlLoader.exclude = [path.resolve(__dirname, '../assets/img/inlineSvg')];
      config.module.rules.push({
        test: /\.svg$/,
        loader: 'svg-inline-loader',
        include: [path.resolve(__dirname, '../assets/img/inlineSvg')],
      });
      if (!ctx.isDev) {
        config.module.rules.push({
          test: /\.(gif|png|jpe?g|svg)$/i,
          //test: /\.(gif|svg)$/i,
          exclude: [path.resolve(__dirname, '../assets/img/inlineSvg')],
          loaders: [{
            loader: "image-webpack-loader",
            query: {
              pngquant: {
                quality: "65-90",
                speed: 4,
                optimizationLevel: 7,
                interlaced: true
              },
              gifsicle: {
                optimizationLevel: 7
              },
              mozjpeg: {
                progressive: true,
                //optimizationLevel: 3,
                quality: 80
              }
            }
          }]
        })
        /**
         * 生成webp文件
         */
        config.module.rules.push({
          test: /\.(png|jpe?g)$/,
          loader: "viawebp-loader",
          enforce: "post",
          options: {
            expose: "default", //webp、all、default
            name: "img/[name].[hash:7].[ext]",
            webp: {
              quality: 75
            }
          }
        });
      }

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
          repeatFlag: "\\[R\\]",
          writeFile: false,
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
  modules: [
    // ['bootstrap-vue/nuxt', {css: false}],
    '@nuxtjs/axios',
  ],
  axios: {
    baseURL: baseDomain.serverHost + baseDomain.apiPrefix,
    browserBaseURL: baseDomain.clientHost + baseDomain.apiPrefix,
    credentials: true,
  },
  plugins: [
    "~/plugins/i18n",
    // {src: "~/plugins/quill", ssr: false},
    "~/plugins/axios",
    "~/plugins/echarts",
    "~/plugins/webp",
    "~/plugins/filters",
    "~/plugins/globalMixin",
    "~/plugins/element-ui",
  ]
};
