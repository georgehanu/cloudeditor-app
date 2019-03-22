const {
  TEST_CHANGE_VARIABLE,
  CHANGE_VARIABLE_VALUE,
  CHANGE_COLOR_VARIABLE_VALUE
} = require("../actionTypes/variables");

const {
  DAG_UPLOAD_IMAGE_SUCCESS
} = require("../../../plugins/DesignAndGo/store/actionTypes/designAndGo");

const { mergeAll } = require("ramda");
const ConfigUtils = require("../../../core/utils/ConfigUtils");

const { handleActions } = require("redux-actions");
const VariableUtils = require("../../utils/VariableUtils");
const initialState = VariableUtils.getDGVariables(ConfigUtils.getDefaults());

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

const changeVariableValue = (state, { name, ...otherProps }) => {
  return {
    ...state,
    variables: {
      ...state.variables,
      [name]: {
        ...state.variables[name],
        ...otherProps
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
      return changeVariableValue(state, {
        name: action.payload.name,
        value: action.payload.value
      });
    },
    [CHANGE_COLOR_VARIABLE_VALUE]: (state, action) => {
      return changeColorVariableValue(state, action.payload);
    },
    [DAG_UPLOAD_IMAGE_SUCCESS]: (state, action) => {
      return changeVariableValue(state, {
        name: "userImage",
        value: action.payload.image_src,
        imageHeight: action.payload.imageHeight,
        imageWidth: action.payload.imageWidth
      });
    }
  },
  initialState
);
