export default () => ({
  sidebarOpen: false,
  sidebarContent: '',
  activeYear: null,
  activeYearImage: null,
  intersected: false,
  defaultWidth: 0,
  scrollX: 0,
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
        `${this.defaultWidth - 27 + diff}px`
      );
    }

    if (diff + 148 < 0) {
      this.activeYear = null;
    }

    const currentMarkerEl = document.getElementById(
      `timeline-${this.activeYear}`
    );

    const currentPhotoEl = document.getElementById(`photo-${this.activeYear}`);

    if (currentMarkerEl) {
      let getBoundingClientRect = currentMarkerEl.getBoundingClientRect();
      if (getBoundingClientRect.x > 0) {
        currentPhotoEl.style.left =
          parseInt(getBoundingClientRect.x / 1, 10) + 'px';
      } else {
        currentPhotoEl.classList.add('axis-item__photo--hide');
      }
    }
    window.requestAnimationFrame(() => that.checkIntersectection());
  },

  init() {
    this.checkIntersectection();
    this.root = document.documentElement;
    const rootStyles = getComputedStyle(this.root);
    this.defaultWidth = parseInt(
      rootStyles.getPropertyValue('--mark-span'),
      10
    );

    this.$watch('activeYear', () => {
      if (this.activeYear !== null) {
        this.activeYearEl.style.opacity = '0';
      }
      setTimeout(() => {
        this.activeYearImage = this.activeYear;
      }, 300);
      setTimeout(() => {
        this.activeYearEl.style.opacity = '1';
      }, 300);
    });
  },
});
