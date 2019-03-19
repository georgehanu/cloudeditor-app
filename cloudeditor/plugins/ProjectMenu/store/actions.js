const {
  AUTH_SIGNIN_START,
  AUTH_SIGNIN_CLEAR_MESSAGE,
  AUTH_REGISTER_START,
  AUTH_REGISTER_CLEAR_MESSAGE
} = require("./actionTypes");
const { createActions } = require("redux-actions");

const { authSigninStart } = createActions(AUTH_SIGNIN_START);
const { authSigninClearMessage } = createActions(AUTH_SIGNIN_CLEAR_MESSAGE);
const { authRegisterStart } = createActions(AUTH_REGISTER_START);
const { authRegisterClearMessage } = createActions(AUTH_REGISTER_CLEAR_MESSAGE);
module.exports = {
  authSigninStart,
  authSigninClearMessage,
  authRegisterStart,
  authRegisterClearMessage
};
