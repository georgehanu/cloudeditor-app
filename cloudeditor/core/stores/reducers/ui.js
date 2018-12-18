const { updateObject } = require("../../utils/UtilUtils");
const {
  CHANGE_ZOOM,
  CHANGE_WORKAREA_PROPS,
  CHANGE_RERENDER_ID
} = require("../actionTypes/ui");

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
const changeRerenderId = (state, payload) => {
  return {
    ...state,
    rerenderId: payload.id
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
    },
    [CHANGE_RERENDER_ID]: (state, action) => {
      return changeRerenderId(state, action.payload);
    }
  },
  initialState
);
