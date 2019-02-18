const { createActions } = require("redux-actions");
const actionTypes = require("./actionTypes");

const actionCreators = createActions(
  actionTypes.PREVIEW_LOAD_PAGE,
  actionTypes.PREVIEW_GET_PAGE,
  actionTypes.PREVIEW_LOAD_PAGE_FAILED,
  actionTypes.PREVIEW_LOAD_PAGE_SUCCESS,
  actionTypes.PREVIEW_DISABLE_MODE,
  actionTypes.ATTACH_PREVIEW
);

module.exports = actionCreators;
