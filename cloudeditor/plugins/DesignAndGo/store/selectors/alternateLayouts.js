const getRealDimmensionSelector = state =>
  (state && state.designAndGo && state.designAndGo.realDimension) || null;
const getRealWidthDimmensionSelector = state =>
  (state &&
    state.designAndGo &&
    state.designAndGo.realDimension &&
    state.designAndGo.realDimension.width) ||
  null;
const getRealHeightDimmensionSelector = state =>
  (state &&
    state.designAndGo &&
    state.designAndGo.realDimension &&
    state.designAndGo.realDimension.height) ||
  null;

module.exports = {
  getRealDimmensionSelector,
  getRealWidthDimmensionSelector,
  getRealHeightDimmensionSelector
};
