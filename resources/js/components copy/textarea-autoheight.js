export default () => ({
  init() {
    const textarea = this.$el;
    if (textarea) {
      textarea.addEventListener('input', () => {
        textarea.style.height = '24px';
        textarea.style.height = textarea.scrollHeight + 1 + 'px';
      });
    }
  },
});
