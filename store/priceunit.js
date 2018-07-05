export const state = () => ({
  options: ['CNY', 'USD'],
  selected: 'CNY'
})

export const mutations = {

  setPriceunit(state, unit) {
    if (!unit) {
      unit = 'CNY'
    }
    state.selected = unit
  }
}
