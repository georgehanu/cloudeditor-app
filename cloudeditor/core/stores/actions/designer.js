const { REMOVE_ELEMENT } = require("../actionTypes/designer");
const { createActions } = require("redux-actions");

const { removeElement } = createActions(REMOVE_ELEMENT);

module.exports = {
  removeElement
};
