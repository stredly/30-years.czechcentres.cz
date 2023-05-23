const YEAR_HEIGHT = 373;
const YEAR_HEIGHT_X_INIT = -20;

const DESKTOP = 'desktop';
const MOBILE = 'mobile';
const TABLET = 'tablet';

export default () => ({
  device: null,
  activeYear: null,
  activeYearImage: null,
  centerX: 0,
  defaultWidth: 0,
  markerHalfSize: 0,
  marks: [],
  root: document.documentElement,
  scrolling: false,
  sidebarContent: '',
  sidebarOpen: false,
  timelineEl: document.getElementById('timeline'),
  activeYearEl: document.getElementById('active-year'),
  timelineCenterEl: document.getElementById('timeline-center'),
  firstMarkerEl: document.getElementById('marker-0'),
  timelineWrapperEl: document.getElementById('timeline-wrapper'),

  fetchSidebarContent(url) {
    fetch(`${url}?fetch=true`)
      .then((response) => response.text())
      .then((text) => {
        this.sidebarContent = text;
        this.sidebarOpen = true;
      });
  },

  animatePhoto() {
    const currentMarkerEl = document.getElementById(
      `timeline-mark-${this.activeYear}`
    );

    if (currentMarkerEl) {
      const currentMarkerBoundingClientRect =
        currentMarkerEl.getBoundingClientRect();
      const currentPhotoEl = document.getElementById(
        `photo-${this.activeYear}`
      );
      const left = parseInt(currentMarkerBoundingClientRect.x * 2, 10);

      currentPhotoEl.classList.toggle('axis-item__photo--active', left > -200);
      currentPhotoEl.style.left = left + 'px';
    }
  },

  checkIntersectection(disablePhotoAnimation = false) {
    if (!this.scrolling) {
      const items = this.marks.filter(
        (item) =>
          item.getBoundingClientRect().left <=
          this.centerX + this.markerHalfSize
      );
      const currentYear = items.length
        ? items[items.length - 1].dataset.year
        : null;

      if (this.activeYear !== currentYear) {
        this.activeYear = parseInt(currentYear, 10);
        const currentYearSet = currentYear !== null;
        this.timelineCenterEl.classList.toggle(
          'timeline__center--visible',
          currentYearSet
        );
        this.firstMarkerEl.parentElement.classList.toggle(
          'axis-item--intersected-center',
          currentYearSet
        );
      }

      this.setAxisLine();

      if (disablePhotoAnimation === false) {
        this.animatePhoto();
      }
    }

    if (this.device === TABLET) {
      requestAnimationFrame(() => this.checkIntersectection());
    }
  },

  setAxisLine() {
    const diff =
      this.activeYear !== null
        ? this.centerX - this.firstMarkerEl.getBoundingClientRect().left
        : 0;
    this.root.style.setProperty(
      '--red-line-width',
      `calc(${this.defaultWidth} + ${diff}px)`
    );
  },

  scrollToYear(year) {
    const element = document.getElementById(`timeline-mark-${year}`);
    if (!element) return;

    this.activeYear = year;

    const scroll =
      element.getBoundingClientRect().left -
      this.centerX -
      this.markerHalfSize +
      this.timelineWrapperEl.scrollLeft;

    const scrollOptions = {
      left: scroll,
      behavior: 'smooth',
    };
    this.scrolling = true;
    this.timelineWrapperEl.scroll(scrollOptions);

    setTimeout(() => {
      this.scrolling = false;
      this.checkIntersectection(true);
    }, 800);
  },

  setClientSizes() {
    const timelineCenterElRect = this.timelineCenterEl.getBoundingClientRect();
    const rootStyles = getComputedStyle(this.root);

    this.centerX = parseInt(timelineCenterElRect.x, 10);
    this.markerHalfSize = this.timelineCenterEl.offsetWidth / 2;
    this.defaultWidth = rootStyles.getPropertyValue('--mark-span');

    if (this.activeYear === null) {
      this.root.style.setProperty(
        '--year-y-position',
        `${timelineCenterElRect.y - YEAR_HEIGHT / 1.62}px`
      );
      this.root.style.setProperty(
        '--year-x-position',
        `${YEAR_HEIGHT_X_INIT}px`
      );
    } else {
      this.root.style.setProperty('--year-x-position', 'center');
      this.root.style.setProperty(
        '--year-y-position',
        this.timelineCenterEl.getBoundingClientRect().y -
          YEAR_HEIGHT / 2 +
          7 +
          'px'
      );
    }
  },

  getPrevYear() {
    const yearElements = document.querySelectorAll(
      '.footer-axis__item__link__year'
    );
    const years = Array.from(yearElements).map((yearElement) =>
      parseInt(yearElement.textContent.trim(), 10)
    );
    years.sort((a, b) => b - a); // Sort the years in descending order
    const activeYearIndex = years.findIndex((year) => year === this.activeYear);

    if (activeYearIndex > 0) {
      return years[activeYearIndex + 1];
    }
  },

  getNextYear() {
    const yearElements = document.querySelectorAll(
      '.footer-axis__item__link__year'
    );
    const years = Array.from(yearElements).map((yearElement) =>
      parseInt(yearElement.textContent.trim(), 10)
    );
    years.sort((a, b) => b - a); // Sort the years in descending order
    const activeYearIndex = years.findIndex((year) => year === this.activeYear);
    if (activeYearIndex > 0) {
      return years[activeYearIndex - 1];
    } else {
      return years[years.length - 1];
    }
  },

  setDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();

    var isMobile = /iPhone|Android/i.test(navigator.userAgent);

    const isTablet =
      /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
        userAgent
      );

    const isIpad =
      /macintosh/i.test(userAgent) &&
      navigator.maxTouchPoints &&
      navigator.maxTouchPoints > 1;

    if (isMobile) {
      this.device = MOBILE;
    } else if (isTablet || isIpad) {
      this.device = TABLET;
    } else {
      this.device = DESKTOP;
    }
  },

  init() {
    this.setDeviceType();

    if (this.device === TABLET) {
      this.timelineWrapperEl.classList.add('timeline-wrapper--is-tablet');
    }

    this.marks = Array.from(
      document.querySelectorAll('[id^="timeline-mark-"]')
    );
    this.$watch('activeYear', () => {
      this.root.style.setProperty('--timeline-year-opacity', '0');
      setTimeout(() => {
        if (this.activeYear === null) {
          this.root.style.setProperty(
            '--year-x-position',
            `${YEAR_HEIGHT_X_INIT}px`
          );
        } else {
          this.root.style.setProperty('--year-x-position', 'center');
          this.root.style.setProperty(
            '--year-y-position',
            this.timelineCenterEl.getBoundingClientRect().y -
              YEAR_HEIGHT / 2 +
              7 +
              'px'
          );
        }
        this.activeYearImage = this.activeYear;
        this.root.style.setProperty('--timeline-year-opacity', '1');
      }, 200);
    });

    if (this.device === DESKTOP) {
      this.timelineWrapperEl.addEventListener('wheel', (evt) => {
        if (this.sidebarOpen) {
          return;
        }
        evt.preventDefault();
        this.timelineWrapperEl.scrollLeft += evt.deltaY;
        this.checkIntersectection();
      });
    } else {
      this.checkIntersectection();
    }

    document.addEventListener('keydown', (event) => {
      if (!this.scrolling) {
        if (event.code === 'ArrowLeft') {
          this.scrollToYear(this.getPrevYear());
        } else if (event.code === 'ArrowRight') {
          this.scrollToYear(this.getNextYear());
        }
      }
    });
  },
});
