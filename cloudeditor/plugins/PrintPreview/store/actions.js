const { createActions } = require("redux-actions");
const actionTypes = require("./actionTypes");

const actionCreators = createActions(
  actionTypes.PREVIEW_LOAD_PAGE,
  actionTypes.PREVIEW_LOAD_PAGE_FAILED,
  actionTypes.PREVIEW_LOAD_PAGE_SUCCESS,
  actionTypes.PREVIEW_DISABLE_MODE
);

module.exports = actionCreators;