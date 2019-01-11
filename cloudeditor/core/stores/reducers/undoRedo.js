const uuidv4 = require("uuid/v4");
const { handleActions } = require("redux-actions");
const initialState = {
  undoQueue: [],
  redoQueue: []
};

module.exports = handleActions({}, initialState);
