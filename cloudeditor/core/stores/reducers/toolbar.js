const { SET_TOOLBAR_POSITION } = require("../actionTypes/toolbar");
const { handleActions } = require("redux-actions");

initialState = {
  targetPositon: { left: 0, top: 0, width: 0, height: 0 }
};

const setToolbarPosition = (state, payload) => {
  return { ...state, targetPosition: { ...state.targetPositon, ...payload } };
};
module.exports = handleActions(
  {
    [SET_TOOLBAR_POSITION]: (state, action) => {
      return setToolbarPosition(state, action.payload);
    }
  },
  initialState
);
