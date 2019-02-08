const uuidv4 = require("uuid/v4");
const { handleActions } = require("redux-actions");
const { pathOr } = require("ramda");
const {
  START_GLOBAL_LOADING,
  STOP_GLOBAL_LOADING
} = require("../actionTypes/globalLoading");
const initialState = {
  enabled: false,
  loading: false,
  errorMessage: null
};

module.exports = handleActions(
  {
    [START_GLOBAL_LOADING]: (state, action) => {
      return { ...state, loading: true, enabled: true };
    },

    [STOP_GLOBAL_LOADING]: (state, action) => {
      return { ...state, loading: false, enabled: false };
    }
  },
  initialState
);
