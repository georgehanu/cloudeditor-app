const {
  createSelectorWithDependencies: createSelector
} = require("reselect-tools");
const { pathOr } = require("ramda");
const getCurrentApiStepSelector = state => {
  return pathOr("", ["imageApi", "current_api"], state);
};
const getApiItemsSelector = state => {
  return pathOr([], ["imageApi", "items"], state);
};
const getFreeImagesDataSelector = state => {
  return pathOr([], ["imageApi", "items", "free_images"], state);
};
const getApiStepsBarSelector = createSelector(
  [getApiItemsSelector, getCurrentApiStepSelector],
  (items, currentStep) => {
    let steps = [];
    steps = Object.keys(items).map(itemKey => {
      const isActive = itemKey === currentStep;
      return {
        label: items[itemKey].label,
        code: itemKey,
        isActive
      };
    });
    return steps;
  }
);

module.exports = {
  getApiStepsBarSelector,
  getCurrentApiStepSelector,
  getApiItemsSelector,
  getFreeImagesDataSelector
};
