const YEAR_HEIGHT = 373;
const YEAR_HEIGHT_X_INIT = 20;

export default () => ({
  sidebarOpen: false,
  sidebarContent: '',
  activeYear: null,
  activeYearImage: null,
  intersected: false,
  defaultWidth: 0,
  centerX: 0,
  activeYearEl: document.getElementById('active-year'),
  timelineCenterEl: document.getElementById('timeline-center'),
  markerEl: document.getElementById('marker-0'),

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
    const markerEl = this.markerEl;
    const timelineCenterElRect = timelineCenterEl.getBoundingClientRect();
    const markerElRect = markerEl.getBoundingClientRect();

    const istimelineCenterElVisible = timelineCenterEl.classList.contains(
      'timeline__center--visible'
    );
    const ismarkerElLeftOftimelineCenterEl =
      markerElRect.x <= timelineCenterElRect.x;

    timelineCenterEl.classList.toggle(
      'timeline__center--visible',
      !istimelineCenterElVisible && ismarkerElLeftOftimelineCenterEl
    );
    markerEl.parentElement.classList.toggle(
      'axis-item--intersected-center',
      !istimelineCenterElVisible && ismarkerElLeftOftimelineCenterEl
    );

    timelineCenterEl.classList.toggle(
      'timeline__center--visible',
      markerElRect.x <= timelineCenterElRect.x
    );
    markerEl.parentElement.classList.toggle(
      'axis-item--intersected-center',
      markerElRect.x <= timelineCenterElRect.x
    );

    const diff = timelineCenterElRect.x - markerElRect.x;

    if (diff > 0) {
      this.root.style.setProperty(
        '--red-line-width',
        `calc(${this.defaultWidth}px - 27px + ${diff}px)`
      );
    } else {
      this.activeYear = null;
      this.root.style.setProperty('--red-line-width', `${this.defaultWidth}px`);
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

  setActiveYear(year, prevYear) {
    this.activeYear = this.activeYear === year ? prevYear : year;
    this.activeYearImage = this.activeYear;
  },

  init() {
    this.root = document.documentElement;
    this.checkIntersectection();
    const rootStyles = getComputedStyle(this.root);
    this.defaultWidth = parseInt(
      rootStyles.getPropertyValue('--mark-span'),
      10
    );

    this.$watch('activeYear', () => {
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

    const timelineCenterElRect = this.timelineCenterEl.getBoundingClientRect();
    this.root.style.setProperty(
      '--year-y-position',
      `${timelineCenterElRect.y - YEAR_HEIGHT / 2}px`
    );
    this.root.style.setProperty('--year-x-position', `${YEAR_HEIGHT_X_INIT}px`);
    this.centerX = timelineCenterElRect.x;
  },
});
