import Vue from "vue"
import {
  mapState
} from "vuex"

export default (app, store) => {
  if (Vue.$plugins_webp_installed) {
    return
  }
  Vue.$plugins_webp_installed = true

  Vue.mixin({
    computed: mapState([
      "webp"
    ]),
    methods: {
      lauchImage(source) {
        if (typeof source === "string") {
          return source;
        }
        if (!(source && typeof source === "object")) {
          return null;
        }
        if (source.webp && this.webp) { //支持webp
          return source.webp;
        } else {
          return source.default;
        }
      }
    }
  })
}
