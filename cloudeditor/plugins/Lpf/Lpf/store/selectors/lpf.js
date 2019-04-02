const {
  createSelectorWithDependencies: createSelector
} = require("reselect-tools");

const { pathOr, pick, filter } = require("ramda");
const getActiveStepSelector = state => {
  return pathOr("", ["project", "activeStep"], state);
};
const getStepsSelector = state => {
  return pathOr({}, ["project", "steps"], state);
};
const getPanelsSelector = state => {
  return pathOr({}, ["project", "panels"], state);
};
const getPanelsOrderSelector = state => {
  return pathOr([], ["project", "panelsOrder"], state);
};
const geActiveStepOptionsSelector = createSelector(
  [getActiveStepSelector, getStepsSelector],
  (activeCode, steps) => {
    return { ...steps[activeCode] };
  }
);
module.exports = {
  getActiveStepSelector,
  getStepsSelector,
  geActiveStepOptionsSelector,
  getPanelsSelector,
  getPanelsOrderSelector
};
