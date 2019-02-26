const {
  TEST_CHANGE_VARIABLE,
  CHANGE_VARIABLE_VALUE,
  CHANGE_COLOR_VARIABLE_VALUE
} = require("../actionTypes/variables");

const { mergeAll } = require("ramda");

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

const changeColorVariableValue = (state, payload) => {
  const colors = Object.keys(payload).map(el => {
    return { [el]: { ...state.variables[el], value: payload[el] } };
  });

  return {
    ...state,
    variables: {
      ...state.variables,
      ...mergeAll(colors)
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
    },
    [CHANGE_COLOR_VARIABLE_VALUE]: (state, action) => {
      return changeColorVariableValue(state, action.payload);
    }
  },
  initialState
);
