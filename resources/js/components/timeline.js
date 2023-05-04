export default () => ({
  sidebarOpen: false,
  sidebarContent: '',
  activeYear: null,

  fetchSidebarContent(url) {
    fetch(`${url}?fetch=true`)
      .then((response) => response.text())
      .then((text) => {
        this.sidebarContent = text;
        this.sidebarOpen = true;
      });
  },
});
