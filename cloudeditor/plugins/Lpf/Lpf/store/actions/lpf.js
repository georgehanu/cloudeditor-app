const {
  UPDATE_PANEL_PROPS,
  ADD_PANEL,
  REMOVE_PANEL,
  CHANGE_STEP
} = require("../actionTypes/lpf");
const { createActions } = require("redux-actions");

const { updatePanelProps, addPanel, removePanel, changeStep } = createActions(
  UPDATE_PANEL_PROPS,
  ADD_PANEL,
  REMOVE_PANEL,
  CHANGE_STEP
);

module.exports = {
  updatePanelProps,
  addPanel,
  removePanel,
  changeStep
};
