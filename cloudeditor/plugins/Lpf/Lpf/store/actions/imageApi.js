const {
  CHANGE_API_STEP,
  CHANGE_SEARCH_CRITERIA,
  CHANGE_ITEMS
} = require("../actionTypes/imageApi");
const { createActions } = require("redux-actions");

const { changeApiStep, changeSearchCriteria, changeItems } = createActions(
  CHANGE_API_STEP,
  CHANGE_SEARCH_CRITERIA,
  CHANGE_ITEMS
);

module.exports = {
  changeApiStep,
  changeSearchCriteria,
  changeItems
};
