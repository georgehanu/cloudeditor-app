const uuidv4 = require("uuid/v4");
const { handleActions } = require("redux-actions");

const initialState = {
  userId: null,
  loggedIn: false,
  userName: null
};

module.exports = handleActions({}, initialState);
