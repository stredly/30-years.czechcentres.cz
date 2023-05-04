export default (value = null, multi = false) => ({
  open: false,
  value: null,
  width: 0,

  get text() {
    if (multi) {
      let ret = '';
      if (this.value) {
        this.value.forEach((item, index) => {
          let title = JSON.parse(item).text;
          ret += title.substring(0, 15);
          if (index < this.value.length - 1) {
            ret += ', ';
          }
        });
      }
      return ret;
    }

    if (!this.value) {
      return null;
    }

    if (JSON.parse(this.value)) {
      return JSON.parse(this.value).text;
    }
    return this.value;
  },

  reset() {
    this.setDefaultState();
  },

  setDefaultState() {
    if (multi) {
      this.value = [];
      if (value) {
        this.value.push(value);
      }
    } else {
      this.value = value;
    }
  },

  init() {
    const queryString = window.location.search;

    if (multi) {
      this.value = [];
    }

    if (queryString.includes('?filter')) {
      const urlSearchParams = new URLSearchParams(queryString);
      let filterSet = [];
      Array.from(urlSearchParams.entries()).map((entry) => {
        if (!filterSet[entry[0]]) {
          filterSet[entry[0]] = [];
        }
        if (entry[1].includes(',')) {
          entry[1].split(',').forEach((item) => filterSet[entry[0]].push(item));
        } else {
          filterSet[entry[0]].push(entry[1]);
        }
      });

      this.value = Array.from(this.$el.querySelectorAll('input'))
        .filter((input) => {
          return Object.keys(filterSet).includes(`filter[${input.name}]`);
        })
        .filter((input) => {
          const haystack = (() => {
            try {
              return JSON.parse(input.value).value;
            } catch {
              return input.value;
            }
          })();
          return filterSet[`filter[${input.name}]`].includes(haystack);
        })
        .map((input) => {
          return input.value;
        });

      if (this.value.length) {
        this.$store.filter.options[this.$el.querySelector('input').name] =
          this.value.map((item) => {
            return JSON.parse(item);
          });
      }
    }

    if (this.value && !this.value.length) {
      return this.setDefaultState();
    }

    if (value) {
      this.setDefaultState();
    }
  },
});
