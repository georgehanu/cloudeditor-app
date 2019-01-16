const {
  AUTH_SIGNIN_START,
  AUTH_SIGNIN_CLEAR_MESSAGE
} = require("./actionTypes");
const { createActions } = require("redux-actions");

const { authSigninStart } = createActions(AUTH_SIGNIN_START);
const { authSigninClearMessage } = createActions(AUTH_SIGNIN_CLEAR_MESSAGE);

module.exports = {
  authSigninStart,
  authSigninClearMessage
};
