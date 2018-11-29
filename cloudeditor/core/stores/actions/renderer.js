// const changeRendererType = rendererType => {
//   return {
//     type: actionTypes.CHANGE_RENDERER_TYPE,
//     rendererType: rendererType
//   };
// };

const {
  CHANGE_RENDERER_TYPE,
  UPDATE_CANVAS_READY
} = require("../actionTypes/renderer");
const { createActions } = require("redux-actions");
const { changeRendererType, updateCanvasReady } = createActions(
  CHANGE_RENDERER_TYPE,
  UPDATE_CANVAS_READY
);

module.exports = {
  changeRendererType,
  updateCanvasReady
};
