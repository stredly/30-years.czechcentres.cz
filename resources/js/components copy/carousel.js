export default (count) => ({
  active: 0,
  count: 0,
  interval: null,

  activate(index) {
    this.active = index;
    if (this.interval) {
      this.resetInterval();
    }
  },

  resetInterval() {
    clearInterval(this.interval);
    this.createInterval();
  },

  createInterval() {
    this.interval = setInterval(() => {
      this.active != this.count - 1 ? this.active++ : (this.active = 0);
    }, 5000);
  },

  init() {
    if (count) {
      this.count = count;
      this.createInterval();
    }
  },
});
