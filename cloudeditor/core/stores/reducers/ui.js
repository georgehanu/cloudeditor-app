const { CHANGE_ZOOM, CHANGE_WORKAREA_PROPS } = require("../actionTypes/ui");

const { handleActions, combineActions } = require("redux-actions");
const ProjectUtils = require("../../utils/ProjectUtils");
const initialState = ProjectUtils.getEmptyUI();
const changeZoom = (state, payload) => {
  return {
    ...state,
    workArea: {
      ...state.workArea,
      zoom: payload
    }
  };
};
const changeWorkAreaProps = (state, payload) => {
  return {
    ...state,
    workArea: {
      ...state.workArea,
      ...payload
    }
  };
};
module.exports = handleActions(
  {
    [CHANGE_ZOOM]: (state, action) => {
      return changeZoom(state, action.payload);
    },
    [CHANGE_WORKAREA_PROPS]: (state, action) => {
      return changeWorkAreaProps(state, action.payload);
    }
  },
  initialState
);
