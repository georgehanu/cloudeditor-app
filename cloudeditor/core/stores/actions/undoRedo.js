const { ADD_UNDO_ITEM } = require("../actionTypes/undoRedo");
const { createActions } = require("redux-actions");

const { addUndoItem } = createActions(ADD_UNDO_ITEM);

module.exports = {
  addUndoItem
};
