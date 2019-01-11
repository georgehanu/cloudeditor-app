const { handleActions } = require("redux-actions");

const {
  AUTH_SIGNIN_START,
  AUTH_SIGNIN_FAILED,
  AUTH_SIGNIN_SUCCESS,
  AUTH_SIGNIN_CLEAR_MESSAGE
} = require("./actionTypes");

const initialState = {
  userId: null,
  loggedIn: false,
  userName: null,
  loading: false,
  errorMessage: null
};

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
    }
  },
  initialState
);
