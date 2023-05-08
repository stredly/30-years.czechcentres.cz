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

  checkIntersectection() {
    const that = this;
    const timelineCenterEl = this.timelineCenterEl;
    const firstMarkerEl = this.firstMarkerEl;
    const timelineCenterElRect = timelineCenterEl.getBoundingClientRect();
    const markerElRect = firstMarkerEl.getBoundingClientRect();

    const istimelineCenterElVisible = timelineCenterEl.classList.contains(
      'timeline__center--visible'
    );
    const ismarkerElLeftOftimelineCenterEl =
      markerElRect.x <= timelineCenterElRect.x;

    timelineCenterEl.classList.toggle(
      'timeline__center--visible',
      !istimelineCenterElVisible && ismarkerElLeftOftimelineCenterEl
    );
    firstMarkerEl.parentElement.classList.toggle(
      'axis-item--intersected-center',
      !istimelineCenterElVisible && ismarkerElLeftOftimelineCenterEl
    );

    timelineCenterEl.classList.toggle(
      'timeline__center--visible',
      markerElRect.x <= timelineCenterElRect.x
    );
    firstMarkerEl.parentElement.classList.toggle(
      'axis-item--intersected-center',
      markerElRect.x <= timelineCenterElRect.x
    );

    const diff = timelineCenterElRect.x - markerElRect.x;

    if (diff > 0) {
      this.root.style.setProperty(
        '--red-line-width',
        `calc(${this.defaultWidth} - 27px + ${diff}px)`
      );
    } else {
      this.activeYear = null;
      this.root.style.setProperty('--red-line-width', `${this.defaultWidth}`);
    }

    this.animatePhoto();

    window.requestAnimationFrame(() => that.checkIntersectection());
  },

  animatePhoto() {
    const currentMarkerEl = document.getElementById(
      `timeline-${this.activeYear}`
    );

    if (currentMarkerEl) {
      const currentMarkerBoundingClientRect =
        currentMarkerEl.getBoundingClientRect();
      const currentPhotoEl = document.getElementById(
        `photo-${this.activeYear}`
      );
      currentPhotoEl.style.left =
        parseInt(currentMarkerBoundingClientRect.x * 2, 10) + 'px';
    }

    /*

    if (currentMarkerEl) {
      let currentMarkerBoundingClientRect =
        currentMarkerEl.getBoundingClientRect();
      if (currentMarkerBoundingClientRect.x > 0) {
        currentPhotoEl.style.left =
          parseInt(currentMarkerBoundingClientRect.x / 1, 10) + 'px';
      } else {
        currentPhotoEl.classList.add('axis-item__photo--hide');
      }

      if (
        currentMarkerBoundingClientRect.x > 0 &&
        currentPhotoEl.classList.contains('axis-item__photo--hide')
      ) {
        currentPhotoEl.classList.remove('axis-item__photo--hide');
      }
    } */
  },

  checkIntersectection2() {
    if (this.scrolling) {
      return;
    }
    const items = this.marks.filter((item) => {
      let rect = item.getBoundingClientRect();
      if (rect.left <= this.centerX + this.markerHalfSize * 2) {
        return item;
      }
    });

    let currentYear = null;
    if (items.length) {
      const last = items.pop();
      currentYear = last.dataset.year;
    } else {
      currentYear = null;
    }

    if (this.activeYear !== currentYear) {
      this.activeYear = currentYear;
      this.timelineCenterEl.classList.toggle(
        'timeline__center--visible',
        currentYear !== null
      );
      this.firstMarkerEl.parentElement.classList.toggle(
        'axis-item--intersected-center',
        currentYear !== null
      );
    }
  },

  setActiveYear(year, prevYear) {
    this.activeYear = this.activeYear === year ? prevYear : year;
    this.activeYearImage = this.activeYear;
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
    }, 1000);
  },

  setClientSizes() {
    const timelineCenterElRect = this.timelineCenterEl.getBoundingClientRect();
    const rootStyles = getComputedStyle(this.root);

    this.centerX = parseInt(timelineCenterElRect.x, 10);
    this.markerHalfSize = this.timelineCenterEl.offsetWidth / 2;
    this.defaultWidth = rootStyles.getPropertyValue('--mark-span');

    this.root.style.setProperty(
      '--year-y-position',
      `${timelineCenterElRect.y - YEAR_HEIGHT / 1.62}px`
    );
    this.root.style.setProperty('--year-x-position', `${YEAR_HEIGHT_X_INIT}px`);
  },

  init() {
    this.marks = Array.from(
      document.querySelectorAll('[id^="timeline-mark-"]')
    );
    /*     this.$watch('activeYear', () => {
      if (this.activeYear === null) {
        this.root.style.setProperty(
          '--year-x-position',
          `${YEAR_HEIGHT_X_INIT}px`
        );
      } else {
        this.root.style.setProperty('--year-x-position', 'center');
      }
      this.activeYearImage = this.activeYear;
    });
 */
  },
});
