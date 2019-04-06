const { handleActions } = require("redux-actions");
const ProjectUtils = require("../../../../../core/utils/ProjectUtils");
const ConfigUtils = require("../../../../../core/utils/ConfigUtils");
const config = ConfigUtils.getDefaults();
const { findIndex, clone, merge } = require("ramda");
const {
  CHANGE_API_STEP,
  CHANGE_SEARCH_CRITERIA,
  CHANGE_ITEMS
} = require("../../store/actionTypes/imageApi");
const initialState = ProjectUtils.getEmptyImageApiConfig(config.image_api);
const changeApiStep = (state, action) => {
  return { ...state, current_api: action.code };
};
const changeSearchCriteria = (state, action) => {
  const { api_code, props } = action;
  return {
    ...state,
    items: { ...state.items, [api_code]: merge(state.items[api_code], props) }
  };
};
module.exports = handleActions(
  {
    [CHANGE_API_STEP]: (state, action) => {
      return changeApiStep(state, action.payload);
    },
    [CHANGE_SEARCH_CRITERIA]: (state, action) => {
      return changeSearchCriteria(state, action.payload);
    },
    [CHANGE_ITEMS]: (state, action) => {
      return changeSearchCriteria(state, action.payload);
    }
  },
  initialState
);
