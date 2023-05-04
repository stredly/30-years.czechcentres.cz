import { BASE_URL_API } from '../misc/consts';
import { locale } from './../alpine-functions';

import pRetry from 'p-retry';

const MULTIPLIER = 0.09290304;

const DEFAULT_SORT_QUERY = '&sort=-date';

export default (showSquareMeters) => ({
  filter: {},
  realEstates: [],
  page: 1,
  meta: null,
  loading: true,

  get itemsInNextPage() {
    if (this.meta === null) {
      return 12;
    }

    return Math.max(
      Math.min(
        this.meta.per_page,
        this.meta.total - this.meta.current_page * this.meta.per_page
      ),
      0
    );
  },

  get foundText() {
    if (this.meta === null) {
      let translations = {
        cs: 'Načítám...',
        sk: 'Načítám...',
        en: 'Loading...',
      };
      return translations[locale];
    }
    if (this.meta.total === 0) {
      let translations = {
        cs: 'Nenalezeny žádné nabídky',
        sk: 'Žiadne výsledky',
        en: 'No results found',
      };
      return translations[locale];
    }

    if (this.meta.total === 1) {
      let translations = {
        cs: 'Nalezena jedna nabídka',
        sk: 'Našla sa jedna nehnuteľnosť',
        en: 'Found one real estate',
      };
      return translations[locale];
    }
    let translations = {
      cs: `Nalezene nabídky: ${this.meta.total}`,
      sk: `Nájdené ponuky: ${this.meta.total}`,
      en: `Found ${this.meta.total} real estates`,
    };
    return translations[locale];
  },

  get filterQuery() {
    const { filter } = this;
    const filterKeys = Object.keys(filter).filter(
      (key) => Array.isArray(filter[key]) && filter[key].length > 0
    );
    const query = filterKeys
      .map((key) => {
        const separator = key.includes('taxonomy') ? ',' : '|';
        let param = filter[key].map((cur) => cur.value).join(separator);
        if (key === 'usable_area:gte' && showSquareMeters) {
          param = Math.round(param / MULTIPLIER);
        }
        return key === 'sort' ? `sort=${param}` : `filter[${key}]=${param}`;
      })
      .join('&');

    const stringQuery = query ? `&${query}` : '';

    return stringQuery.includes('&sort=')
      ? stringQuery
      : stringQuery + DEFAULT_SORT_QUERY;
  },

  filterUpdated() {
    this.page = 0;
    this.meta = null;
    this.realEstates = [];
    this.fetchRealEstates();
  },

  price(from, to) {
    const fromFilter = this.filter[from];
    const toFilter = this.filter[to];

    if (!fromFilter && !toFilter) {
      return '';
    }

    const currency =
      fromFilter && fromFilter[0].value >= 1000000 ? 'Mil.' : 'Tis.';
    const divider =
      fromFilter && fromFilter[0].value >= 1000000 ? 1000000 : 1000;

    if (fromFilter && toFilter) {
      const fromPrice = fromFilter[0].value / divider;
      const toCurrency = toFilter[0].value >= 1000000 ? 'Mil.' : 'Tis.';
      const toDivider = toFilter[0].value >= 1000000 ? 1000000 : 1000;

      const toPrice = toFilter[0].value / toDivider;

      return `${fromPrice} ${currency} - ${toPrice} ${toCurrency}`;
    } else if (fromFilter) {
      const fromPrice = fromFilter[0].value / divider;
      return `od ${fromPrice} ${currency}`;
    } else {
      const currency =
        toFilter && toFilter[0].value >= 1000000 ? 'Mil.' : 'Tis.';
      const divider = toFilter && toFilter[0].value >= 1000000 ? 1000000 : 1000;
      const toPrice = toFilter[0].value / divider;

      return `do ${toPrice} ${currency}`;
    }
  },

  date(dateFilter) {
    const date = new Date(this.filter[dateFilter][0].value);
    return 'Q' + Math.floor(date.getMonth() / 3 + 1) + '/' + date.getFullYear();
  },

  reset() {
    this.$store.filter.options = {};
    this.filter = this.$store.filter.options;
    this.loading = true;
    this.meta = null;
  },

  async fetchData() {
    const response = await fetch(
      `${BASE_URL_API}&filter[site]=${locale}&page=${this.page}${this.filterQuery}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async fetchWithRetry() {
    const options = {
      retries: 3, // Number of times to retry before failing
      minTimeout: 1000, // Minimum delay between retries in milliseconds
      maxTimeout: 5000, // Maximum delay between retries in milliseconds
      factor: 2, // Exponential factor for retry delay
    };

    try {
      const result = await pRetry(() => this.fetchData(), options);
      return result;
    } catch (error) {
      console.error(error);
    }
  },

  fetchRealEstates() {
    if (this.meta !== null && this.page === this.meta.last_page) {
      return;
    }
    this.loading = true;

    this.page++;

    this.fetchWithRetry().then((data) => {
      this.loading = false;
      this.realEstates.push(...data.data);
      this.meta = data.meta;
    });
  },

  formataDate(stringDate) {
    const date = new Date(stringDate);
    const month = date.getMonth();
    const quarter = Math.floor(month / 3) + 1;
    const year = date.getFullYear();
    return `Q${quarter}/${year}`;
  },

  init() {
    this.filter = this.$store.filter.options;
    this.$watch('filter', () => {
      this.filterUpdated();
    });

    const queryString = window.location.search;

    if (queryString.includes('?filter')) {
      this.filterUpdated();
    }
  },
});
