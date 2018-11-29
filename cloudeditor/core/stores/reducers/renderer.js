const {
  CHANGE_RENDERER_TYPE,
  UPDATE_CANVAS_READY
} = require("../actionTypes/renderer");
const { handleActions } = require("redux-actions");

const initialState = {
  type: "fabricjs",
  canvasReady: false
};

module.exports = handleActions(
  {
    [CHANGE_RENDERER_TYPE]: (state, action) => {
      return {
        ...state,
        type: action.payload
      };
    },
    [UPDATE_CANVAS_READY]: (state, action) => {
      return { ...state, canvasReady: action.payload };
    }
  },
  initialState
);
