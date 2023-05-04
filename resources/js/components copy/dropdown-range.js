export default () => ({
  from: null,
  to: null,

  valueUnder(value) {
    if (this.to) {
      return value < parseInt(this.to.replace(/ /g, ''));
    }
    return true;
  },

  valueOver(value) {
    if (this.from) {
      return value > parseInt(this.from.replace(/ /g, ''));
    }
    return true;
  },

  init() {},
});
