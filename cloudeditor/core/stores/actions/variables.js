const {
  TEST_CHANGE_VARIABLE,
  CHANGE_VARIABLE_VALUE
} = require("../actionTypes/variables");
const { createActions } = require("redux-actions");

const { testChangeVariable, changeVariableValue } = createActions(
  TEST_CHANGE_VARIABLE,
  CHANGE_VARIABLE_VALUE
);

module.exports = {
  testChangeVariable,
  changeVariableValue
};
