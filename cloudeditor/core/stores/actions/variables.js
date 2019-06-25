const {
  TEST_CHANGE_VARIABLE,
  CHANGE_VARIABLE_VALUE,
  CHANGE_COLOR_VARIABLE_VALUE,
  UPDATE_OBJ_FROM_VARIABLE_INIT,
  PROJ_LOAD_VARIABLES_SUCCESS
} = require("../actionTypes/variables");
const { createActions } = require("redux-actions");

const {
  testChangeVariable,
  changeVariableValue,
  changeColorVariableValue,
  updateObjFromVariableInit,
  projLoadVariablesSuccess
} = createActions(
  TEST_CHANGE_VARIABLE,
  CHANGE_VARIABLE_VALUE,
  CHANGE_COLOR_VARIABLE_VALUE,
  UPDATE_OBJ_FROM_VARIABLE_INIT,
  PROJ_LOAD_VARIABLES_SUCCESS
);

module.exports = {
  testChangeVariable,
  changeVariableValue,
  changeColorVariableValue,
  updateObjFromVariableInit,
  projLoadVariablesSuccess
};
