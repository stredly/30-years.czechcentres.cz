export default () => ({
  sidebarOpen: false,
  sidebarContent: '',
  activeYear: null,
  intersected: false,
  defaultWidth: 0,
  timelineCenter: document.getElementById('timeline-center'),
  marker: document.getElementById('marker-0'),

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
    const timelineCenterRect = this.timelineCenter.getBoundingClientRect();
    const markerRect = this.marker.getBoundingClientRect();

    const isTimelineCenterVisible = this.timelineCenter.classList.contains(
      'timeline__center--visible'
    );
    const isMarkerLeftOfTimelineCenter = markerRect.x <= timelineCenterRect.x;

    if (!isTimelineCenterVisible && isMarkerLeftOfTimelineCenter) {
      this.timelineCenter.classList.add('timeline__center--visible');
      this.marker.parentElement.classList.add('axis-item--intersected-center');
    }

    if (markerRect.x > timelineCenterRect.x && isTimelineCenterVisible) {
      this.timelineCenter.classList.remove('timeline__center--visible');
      this.marker.parentElement.classList.remove(
        'axis-item--intersected-center'
      );
    }

    const diff = parseInt(timelineCenterRect.x - markerRect.x, 10);

    if (diff > 0) {
      this.root.style.setProperty(
        '--red-line-width',
        this.defaultWidth - 27 + diff + 'px'
      );
    } else {
      this.activeYear = null;
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
  },
});
