export default () => ({
  expand: false,

  filterChanged() {
    let filter = {
      filter: this.$el.name,
      values: this.value,
    };
    this.$store.filter.set(filter);
  },

  init() {},
});
