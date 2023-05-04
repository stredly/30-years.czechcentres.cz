export default () => ({
  open: false,

  toggle() {
    this.open = !this.open;
    this.open
      ? document.body.classList.add('stop-scrolling')
      : document.body.classList.remove('stop-scrolling');
  },

  init() {
    const horizontalScrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.setProperty(
      '--horizontal-scrollbar-width',
      horizontalScrollbarWidth + 'px'
    );
  },
});
