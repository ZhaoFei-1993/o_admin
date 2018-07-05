export const state = () => ({
  options: ['legacy', 'copay', 'cash'],
  selected: 'legacy'
});

export const mutations = {
  setAddressFormat(state, format) {
    if (!format || state.options.indexOf(format) < 0) {
      format = 'legacy';
    }
    state.selected = format;
  }
};
