import { stopScrolling, startScrolling } from '../alpine-functions';

export default (target, autoOpen) => ({
  originContent: '',
  contentElement: null,
  modal: null,
  target: target,
  close: '',

  init() {
    this.modal = document.getElementById(target);
    this.close = this.modal.querySelector('.alpine-modal__close');
    if (autoOpen) {
      setTimeout(() => {
        this.handleModal();
      }, 500);
    }
  },

  handleModal() {
    const source = this.$el.dataset.source;
    const targetContent = this.modal.querySelector('.alpine-modal__content');
    this.modal.classList.add('alpine-modal--loading');
    this.getContent(source, targetContent);
  },

  openModal() {
    stopScrolling();
    this.modal.classList.remove('alpine-modal--loading');
    this.close.classList.remove('alpine-modal__close--hidden');
    this.modal.classList.add('alpine-modal--open');
  },

  closeModal(close = true) {
    if (close) {
      this.modal.classList.remove('alpine-modal--loading');
      this.modal.classList.remove('alpine-modal--open');
    }
    this.close.classList.add('alpine-modal__close--hidden');
    startScrolling();
    this.revertContent();
    this.contentElement = null;
  },

  getContent(source, target) {
    this.contentElement = document.getElementById(source);
    this.originContent = `${this.contentElement.innerHTML}`;
    this.handleContent(target);
    setTimeout(() => {
      this.openModal();
    }, 50);
  },

  revertContent() {
    if (this.contentElement !== null) {
      this.contentElement.innerHTML = this.originContent;
    } else {
      this.modal.querySelector('.alpine-modal__content').innerHTML = '';
    }
  },

  handleContent(target) {
    this.contentElement.innerHTML = '';
    target.innerHTML = this.originContent;
  },
});
