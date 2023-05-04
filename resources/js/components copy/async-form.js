import docCookies from 'doc-cookies';
import { getXsfrToken } from '../alpine-functions';

export default () => ({
  form: null,
  sent: false,
  failed: false,

  init() {
    this.form = this.$el;
  },

  get action() {
    return this.form.action;
  },

  resetForm() {
    this.form.reset();
  },

  isValid() {
    return this.form.reportValidity();
  },

  async send() {
    if (!this.isValid()) {
      return false;
    }
    await getXsfrToken();

    const data = new URLSearchParams(new FormData(this.form));

    fetch(this.action, {
      body: data,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-XSRF-TOKEN': docCookies.getItem('XSRF-TOKEN'),
      },
      method: 'POST',
    })
      .then((response) => {
        if (response.ok) {
          this.resetForm();
          this.sent = true;
          return;
        }
        throw new Error('Something went wrong.');
      })
      .catch((error) => {
        console.error('Error:', error);
        this.sent = true;
        this.failed = true;
      });
  },
});
