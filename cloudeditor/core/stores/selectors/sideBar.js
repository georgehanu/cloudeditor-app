const sideBarExpandedSelector = state =>
  (state && state.sidebar && state.sidebar.expanded) || true;
const sideBarActiveSelector = state =>
  (state && state.sidebar && state.sidebar.expanded) || true;

module.exports = { sideBarExpandedSelector, sideBarActiveSelector };
