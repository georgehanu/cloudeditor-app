const { ZOOM_CHANGE_ZOOM } = require("./actionTypes");
const { handleActions } = require("redux-actions");

const initialState = {
  zoomValue: 100
};

module.exports = handleActions(
  {
    [ZOOM_CHANGE_ZOOM]: (state, action) => {
      console.log(action, "ZOOM");
      return {
        ...state,
        zoomValue: action.payload
      };
    }
  },
  initialState
);
