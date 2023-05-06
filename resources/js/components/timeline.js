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
    const timelineCenter = this.timelineCenter;
    const marker = this.marker;
    const timelineCenterRect = timelineCenter.getBoundingClientRect();
    const markerRect = marker.getBoundingClientRect();

    const isTimelineCenterVisible = timelineCenter.classList.contains(
      'timeline__center--visible'
    );
    const isMarkerLeftOfTimelineCenter = markerRect.x <= timelineCenterRect.x;

    timelineCenter.classList.toggle(
      'timeline__center--visible',
      !isTimelineCenterVisible && isMarkerLeftOfTimelineCenter
    );
    marker.parentElement.classList.toggle(
      'axis-item--intersected-center',
      !isTimelineCenterVisible && isMarkerLeftOfTimelineCenter
    );

    timelineCenter.classList.toggle(
      'timeline__center--visible',
      markerRect.x <= timelineCenterRect.x
    );
    marker.parentElement.classList.toggle(
      'axis-item--intersected-center',
      markerRect.x <= timelineCenterRect.x
    );

    const diff = timelineCenterRect.x - markerRect.x;

    if (diff > 0) {
      this.root.style.setProperty(
        '--red-line-width',
        `${this.defaultWidth - 27 + diff}px`
      );
    }

    if (diff + 148 < 0) {
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
