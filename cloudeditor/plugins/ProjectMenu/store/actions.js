const {
  AUTH_SIGNIN_START,
  AUTH_SIGNIN_CLEAR_MESSAGE,
  AUTH_REGISTER_START
} = require("./actionTypes");
const { createActions } = require("redux-actions");

const { authSigninStart } = createActions(AUTH_SIGNIN_START);
const { authSigninClearMessage } = createActions(AUTH_SIGNIN_CLEAR_MESSAGE);
const { authRegisterStart } = createActions(AUTH_REGISTER_START);
module.exports = {
  authSigninStart,
  authSigninClearMessage,
  authRegisterStart
};
