const { SET_OBJECT_FROM_TOOLBAR } = require("../actionTypes/toolbar");
const { createActions } = require("redux-actions");

const { setObjectFromToolbar } = createActions(SET_OBJECT_FROM_TOOLBAR);

module.exports = {
  setObjectFromToolbar
};
