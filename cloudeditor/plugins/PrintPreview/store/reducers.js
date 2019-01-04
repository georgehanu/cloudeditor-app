const actionTypes = require("./actionTypes");

const { handleActions } = require("redux-actions");

const initialState = {
  enabled: false,
  loading: false,
  pageUrl: null,
  errorMessage: null
};

module.exports = handleActions(
  {
    [actionTypes.PREVIEW_LOAD_PAGE]: (state, action) => {
      return {
        ...state,
        loading: true,
        enabled: true
      };
    },

    [actionTypes.PREVIEW_LOAD_PAGE_SUCCESS]: (state, action) => {
      return {
        ...state,
        pageUrl: action.payload,
        errorMessage: null,
        loading: false
      };
    },

    [actionTypes.PREVIEW_LOAD_PAGE_FAILED]: (state, action) => {
      return {
        ...state,
        pageUrl: null,
        errorMessage: action.payload,
        loading: false
      };
    },

    [actionTypes.PREVIEW_DISABLE_MODE]: (state, action) => {
      return { ...state, enabled: false };
    }
  },
  initialState
);
