const { handleActions } = require("redux-actions");

const {
  AUTH_SIGNIN_START,
  AUTH_SIGNIN_FAILED,
  AUTH_SIGNIN_SUCCESS,
  AUTH_SIGNIN_CLEAR_MESSAGE,
  AUTH_REGISTER_CLEAR_MESSAGE
} = require("./actionTypes");

const ProjectUtils = require("../../../core/utils/ProjectUtils");
const ConfigUtils = require("../../../core/utils/ConfigUtils");

const config = ConfigUtils.getDefaults();

const initialState = ProjectUtils.getEmptyAuth(config.auth);

module.exports = handleActions(
  {
    [AUTH_SIGNIN_START]: (state, action) => {
      return {
        ...state,
        loading: true
      };
    },
    [AUTH_SIGNIN_SUCCESS]: (state, action) => {
      return {
        ...state,
        loading: false,
        errorMessage: null,
        loggedIn: true
      };
    },
    [AUTH_SIGNIN_FAILED]: (state, action) => {
      return {
        ...state,
        loading: false,
        errorMessage: action.payload
      };
    },
    [AUTH_SIGNIN_CLEAR_MESSAGE]: (state, action) => {
      return {
        ...state,
        errorMessage: null
      };
    },
    [AUTH_REGISTER_CLEAR_MESSAGE]: (state, action) => {
      return {
        ...state,
        errorMessage: null
      };
    }
  },
  initialState
);
