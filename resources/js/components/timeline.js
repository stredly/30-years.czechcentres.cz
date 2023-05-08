const YEAR_HEIGHT = 373;
const YEAR_HEIGHT_X_INIT = -20;

export default () => ({
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
      console.log(left);

      currentPhotoEl.classList.toggle('axis-item__photo--active', left > -200);
      currentPhotoEl.style.left = left + 'px';
    }
  },

  checkIntersectection() {
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
      this.animatePhoto();
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
      this.timelineEl.scrollLeft;

    const scrollOptions = {
      left: scroll,
      behavior: 'smooth',
    };
    this.scrolling = true;
    this.timelineEl.scroll(scrollOptions);

    setTimeout(() => {
      this.scrolling = false;
      this.checkIntersectection();
    }, 1000);
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

  init() {
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
  },
});
