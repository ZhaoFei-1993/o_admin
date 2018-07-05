export const state = () => ({
  options: ["en_US", "zh_Hans_CN", "zh_Hant_HK"], // available langages
  lang: 'zh_Hans_CN' //"en_US", "zh_Hans_CN", "zh_Hant_HK"
})

export const mutations = {

  setLang(state, lang) {
    state.lang = lang
  }
}
