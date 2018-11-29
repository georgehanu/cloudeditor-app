const {
  TOGGLE_SIDEBAR,
  EXPAND_SIDEBAR,
  CLOSE_SIDEBAR,
  ACTIVATE_SIDEBAR,
  DEACTIVATE_SIDEBAR
} = require("../actionTypes/sideBar");

const initialState = {
  expanded: true,
  active: true
};

const { handleActions, combineActions } = require("redux-actions");

module.exports = handleActions(
  {
    [TOGGLE_SIDEBAR]: (state, _) => {
      return { ...state, expanded: !state.expanded };
    },
    [combineActions(EXPAND_SIDEBAR, CLOSE_SIDEBAR)]: (state, action) => {
      return { ...state, expanded: action.payload };
    },
    [combineActions(ACTIVATE_SIDEBAR, DEACTIVATE_SIDEBAR)]: (state, action) => {
      return { ...state, active: action.payload };
    }
  },
  initialState
);
