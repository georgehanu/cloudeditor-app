const {
  TOGGLE_SIDEBAR,
  EXPAND_SIDEBAR,
  CLOSE_SIDEBAR,
  ACTIVATE_SIDEBAR,
  DEACTIVATE_SIDEBAR
} = require("../actionTypes/sideBar");

const { createActions } = require("redux-actions");

const {
  toggleSidebar,
  expandSidebar,
  closeSidebar,
  activateSidebar,
  deactivateSidebar
} = createActions(
  {
    [EXPAND_SIDEBAR]: () => true,
    [CLOSE_SIDEBAR]: () => false,
    [ACTIVATE_SIDEBAR]: () => true,
    [DEACTIVATE_SIDEBAR]: () => false
  },
  TOGGLE_SIDEBAR
);

module.exports = {
  toggleSidebar,
  expandSidebar,
  closeSidebar,
  activateSidebar,
  deactivateSidebar
};
