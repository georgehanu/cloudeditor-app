const {
  UI_UPDATE_WORK_AREA_OFFSET_PAGE_OFSSET,
  UI_UPDATE_CONTAINER_CANVAS_OFFSET,
  UI_UPDATE_VIEWPORT_TRANSFORM,
  UPDATE_ZOOM,
  CHANGE_ZOOM,
  CHANGE_WORKAREA_PROPS,
  CHANGE_RERENDER_ID,
  UI_ADD_COLOR,
  UI_ADD_LAST_USED_COLOR
} = require("../actionTypes/ui");
const { createActions } = require("redux-actions");

const {
  uiUpdateWorkAreaOffsetPageOfsset,
  uiUpdateContainerCanvasOffset,
  uiUpdateViewportTransform,
  updateZoom,
  changeZoom,
  changeWorkareaProps,
  changeRerenderId,
  uiAddColor,
  uiAddLastUsedColor
} = createActions(
  UI_UPDATE_WORK_AREA_OFFSET_PAGE_OFSSET,
  UI_UPDATE_CONTAINER_CANVAS_OFFSET,
  UI_UPDATE_VIEWPORT_TRANSFORM,
  UPDATE_ZOOM,
  CHANGE_ZOOM,
  CHANGE_WORKAREA_PROPS,
  CHANGE_RERENDER_ID,
  UI_ADD_COLOR,
  UI_ADD_LAST_USED_COLOR
);

module.exports = {
  uiUpdateWorkAreaOffsetPageOfsset,
  uiUpdateContainerCanvasOffset,
  uiUpdateViewportTransform,
  updateZoom,
  changeZoom,
  changeWorkareaProps,
  changeRerenderId,
  uiAddColor,
  uiAddLastUsedColor
};
