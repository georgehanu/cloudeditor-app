const {
  createSelectorWithDependencies: createSelector
} = require("reselect-tools");
const { pathOr } = require("ramda");
const getCurrentDecorationsStep = state => {
  return pathOr("", ["decorations", "currentDecoration"], state);
};
const getDecorationsItems = state => {
  return pathOr([], ["decorations", "items"], state);
};
const getSocketItemsSelector = state => {
  return pathOr([], ["decorations", "items", "sockets", "items"], state);
};
const getOvalRectangleSelector = state => {
  return pathOr([], ["decorations", "items", "cutouts", "items"], state);
};
const getShapesItemsSelector = state => {
  return pathOr([], ["decorations", "items", "shapes", "items"], state);
};
const getMenuBarStepsSelector = createSelector(
  [getDecorationsItems, getCurrentDecorationsStep],
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
const getCurrentDecorationInfo = createSelector(
  [getCurrentDecorationsStep, getDecorationsItems],
  (activeDecoration, items) => {
    return { ...items[activeDecoration] };
  }
);
module.exports = {
  getCurrentDecorationsStep,
  getDecorationsItems,
  getCurrentDecorationInfo,
  getMenuBarStepsSelector,
  getSocketItemsSelector,
  getOvalRectangleSelector,
  getShapesItemsSelector
};
