const { ZOOM_CHANGE_ZOOM } = require("./actionTypes");

const { createActions } = require("redux-actions");

const { zoomChangeZoom } = createActions(ZOOM_CHANGE_ZOOM);

module.exports = {
  zoomChangeZoom
};
