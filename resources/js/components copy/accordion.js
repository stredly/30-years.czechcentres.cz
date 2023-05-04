export default () => ({
  open: false,

  toggle(e) {
    if (this.open) {
      e.target.parentNode.classList.remove('accordion--open');
      e.target.nextElementSibling.style.maxHeight = null;
    } else {
      e.target.parentNode.classList.add('accordion--open');
      e.target.nextElementSibling.style.maxHeight =
        e.target.nextElementSibling.scrollHeight + 'px';
    }
    this.open = !this.open;
  },

  init() {},
});
