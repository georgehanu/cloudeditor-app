const {
  TEST_CHANGE_VARIABLE,
  CHANGE_VARIABLE_VALUE,
  CHANGE_COLOR_VARIABLE_VALUE
} = require("../actionTypes/variables");
const { createActions } = require("redux-actions");

const {
  testChangeVariable,
  changeVariableValue,
  changeColorVariableValue
} = createActions(
  TEST_CHANGE_VARIABLE,
  CHANGE_VARIABLE_VALUE,
  CHANGE_COLOR_VARIABLE_VALUE
);

module.exports = {
  testChangeVariable,
  changeVariableValue,
  changeColorVariableValue
};
