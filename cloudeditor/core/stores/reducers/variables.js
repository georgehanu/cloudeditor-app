const {
  TEST_CHANGE_VARIABLE,
  CHANGE_VARIABLE_VALUE
} = require("../actionTypes/variables");

const { handleActions } = require("redux-actions");
const VariableUtils = require("../../utils/VariableUtils");
const initialState = VariableUtils.getDGVariables();

const testChangeVariable = state => {
  return {
    ...state,
    variables: {
      ...state.variables,
      jarName: {
        ...state.variables.jarName,
        general: { ...state.variables.jarName.general, displayFilter: "" }
      }
    }
  };
};

const changeVariableValue = (state, payload) => {
  return {
    ...state,
    variables: {
      ...state.variables,
      [payload.name]: {
        ...state.variables[payload.name],
        value: payload.value
      }
    }
  };
};

module.exports = handleActions(
  {
    [TEST_CHANGE_VARIABLE]: (state, action) => {
      return testChangeVariable(state);
    },
    [CHANGE_VARIABLE_VALUE]: (state, action) => {
      return changeVariableValue(state, action.payload);
    }
  },
  initialState
);
