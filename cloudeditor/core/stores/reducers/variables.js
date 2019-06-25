const {
  TEST_CHANGE_VARIABLE,
  CHANGE_VARIABLE_VALUE,
  CHANGE_COLOR_VARIABLE_VALUE,
  CHECK_VARIABLE_VALID,
  PROJ_LOAD_VARIABLES_SUCCESS
} = require("../actionTypes/variables");

const {
  DAG_UPLOAD_IMAGE_SUCCESS
} = require("../../../plugins/DesignAndGo/store/actionTypes/designAndGo");

const { mergeAll, mergeDeepRight } = require("ramda");
const ConfigUtils = require("../../../core/utils/ConfigUtils");

const { handleActions } = require("redux-actions");
const VariableUtils = require("../../utils/VariableUtils");
const initialState = VariableUtils.getDGVariables(ConfigUtils.getDefaults());
const {
  checkIfVariableIsValid
} = require("../../utils/ObjectFromVariableUtils");

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
  const clearColors = {
    color1: { ...state.variables.color1, value: null },
    color2: { ...state.variables.color2, value: null },
    color3: { ...state.variables.color3, value: null }
  };

  return {
    ...state,
    variables: {
      ...state.variables,
      ...clearColors,
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
      console.log("Upload", action);
      return changeVariableValue(state, {
        name: "userImage",
        value: action.payload.image_src,
        image_path: action.payload.image_path,
        image_src: action.payload.image_src,
        imageHeight: action.payload.imageHeight,
        imageWidth: action.payload.imageWidth,
        ratioHeight: action.payload.ratioHeight,
        ratioWidth: action.payload.ratioWidth
      });
    },
    [CHECK_VARIABLE_VALID]: (state, action) => {
      return checkIfVariableIsValid(state, action.payload);
    },
    [PROJ_LOAD_VARIABLES_SUCCESS]: (state, action) => {
      var data = action.data;
      const variables = mergeDeepRight(state.variables, data.variables);
      return {
        ...state,
        variables: {
          ...state.variables,
          ...variables
        }
      };
    }
  },
  initialState
);
