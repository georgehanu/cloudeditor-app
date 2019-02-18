const uuidv4 = require("uuid/v4");
const { handleActions } = require("redux-actions");
const { pathOr } = require("ramda");
const {
  UPDATE_LAYOUT_TEMPLATE,
  SAVE_LAYOUT_TEMPLATE_START,
  SAVE_LAYOUT_TEMPLATE_FAILED,
  SAVE_LAYOUT_TEMPLATE_SUCCESS,
  SAVE_ICON_TEMPLATE_START,
  SAVE_ICON_TEMPLATE_FAILED,
  SAVE_ICON_TEMPLATE_SUCCESS
} = require("../actionTypes/layout_template");
const ProjectUtils = require("../../utils/ProjectUtils");
const ConfigUtils = require("../../utils/ConfigUtils");
const config = ConfigUtils.getDefaults();
const { mergeDeepRight } = require("ramda");
const initialState = ProjectUtils.getEmptyLayoutTemplateConfig(
  config.layoutTemplateCnfg
);

const updateLayoutTemplate = (state, payload) => {
  return {
    ...mergeDeepRight(state, payload)
  };
};

module.exports = handleActions(
  {
    [UPDATE_LAYOUT_TEMPLATE]: (state, action) => {
      return updateLayoutTemplate(state, action.payload);
    },
    [SAVE_LAYOUT_TEMPLATE_START]: (state, action) => {
      return { ...state, loading: true };
    },
    [SAVE_LAYOUT_TEMPLATE_FAILED]: (state, action) => {
      return {
        ...state,
        loading: false,
        message: action.payload,
        showAlert: true
      };
    },
    [SAVE_LAYOUT_TEMPLATE_SUCCESS]: (state, action) => {
      return { ...state, loading: false };
    },
    [SAVE_ICON_TEMPLATE_START]: (state, action) => {
      return { ...state, loading: true };
    },
    [SAVE_ICON_TEMPLATE_FAILED]: (state, action) => {
      return {
        ...state,
        loading: false,
        message: action.payload,
        showAlert: true
      };
    },
    [SAVE_ICON_TEMPLATE_SUCCESS]: (state, action) => {
      return {
        ...state,
        loading: false,
        projectIcon: action.projectIcon,
        projectIconSrc: action.projectIconSrc
      };
    }
  },
  initialState
);
