const ProjectUtils = require("../../../../../core/utils/ProjectUtils");
const ConfigUtils = require("../../../../../core/utils/ConfigUtils");
const { handleActions } = require("redux-actions");
const { append, merge } = require("ramda");
const {
  UPDATE_PANEL_PROPS,
  ADD_PANEL,
  REMOVE_PANEL,
  CHANGE_STEP
} = require("../actionTypes/lpf");
const uuidv4 = require("uuid/v4");
const config = ConfigUtils.getDefaults();
const emptyProject = ProjectUtils.getEmptyProject(config.project);

const initialState = {
  ...emptyProject
};

const addCreatedPanel = (state, action, panel) => {
  return {
    ...state,
    panelsOrder: append(panel.id, state.panelsOrder),
    panels: {
      ...state.panels,
      [panel.id]: panel
    }
  };
};

const removePanel = (state, payload) => {
  let newPanels = { ...state.panels };
  delete newPanels[payload.id];
  const newPanelsOrder = state.panelsOrder.filter(el => {
    return el !== payload.id;
  });
  return { ...state, panels: newPanels, panelsOrder: newPanelsOrder };
};
const addPanel = (state, action) => {
  return addCreatedPanel(state, action, ProjectUtils.getEmptyPanel(action));
};
const updatePanelProps = (state, payload) => {
  return {
    ...state,
    panels: {
      ...state.panels,
      [payload.id]: merge(state.panels[payload.id], payload.props)
    }
  };
};
const changeStep = (state, action) => {
  return {
    ...state,
    activeStep: action.code
  };
};
module.exports = handleActions(
  {
    [UPDATE_PANEL_PROPS]: (state, action) => {
      return updatePanelProps(state, action.payload);
    },
    [ADD_PANEL]: (state, action) => {
      return addPanel(state, action.payload);
    },
    [REMOVE_PANEL]: (state, action) => {
      return removePanel(state, action.payload);
    },
    [CHANGE_STEP]: (state, action) => {
      return changeStep(state, action.payload);
    }
  },
  initialState
);
