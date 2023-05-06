export default () => ({
  sidebarOpen: false,
  sidebarContent: '',
  activeYear: null,
  intersected: false,
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

    window.requestAnimationFrame(() => that.checkIntersectection());
  },

  init() {
    this.checkIntersectection();
  },
});
