const {
  SET_OBJECT_FROM_TOOLBAR,
  SET_TOOLBAR_POSITION
} = require("../actionTypes/toolbar");
const { createActions } = require("redux-actions");

const { setObjectFromToolbar, setToolbarPosition } = createActions(
  SET_OBJECT_FROM_TOOLBAR,
  SET_TOOLBAR_POSITION
);

module.exports = {
  setObjectFromToolbar,
  setToolbarPosition
};
