export const state = () => ({
  options: [null, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // available langages
  selected: null,
  current: 8
})

export const mutations = {

  setTimezone(state, timezone) {
    if (timezone !== null) {
      timezone = parseInt(timezone)
    }
    state.selected = timezone
  },
  setCurrent(state, current) {
    state.current = current
  }
}
