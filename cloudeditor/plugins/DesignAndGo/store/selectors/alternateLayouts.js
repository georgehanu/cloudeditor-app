const { createSelector } = require("reselect");
const { mmToPx } = require("../../../../core/utils/GlobalUtils");
const { forEachObjIndexed, toUpper } = require("ramda");

const getCorrectAlternateLayoutIndex = (
  alternateLayouts,
  clientPageWidth,
  clientPageHeight
) => {
  let indexResult = -1;
  forEachObjIndexed((alternateLayout, pKey) => {
    switch (toUpper(alternateLayout.rangeBy)) {
      case "WIDTH":
        if (
          clientPageWidth >= alternateLayout.minDim &&
          clientPageHeight <= alternateLayout.maxDim
        ) {
          indexResult = pKey;
        }
        break;
      case "HEIGHT":
        if (
          clientPageHeight >= alternateLayout.minDim &&
          clientPageHeight <= alternateLayout.maxDim
        ) {
          indexResult = pKey;
        }
        break;
      case "BOTH":
        if (
          clientPageHeight >= alternateLayout.minDim &&
          clientPageHeight <= alternateLayout.maxDim &&
          clientPageWidth >= alternateLayout.minDim &&
          clientPageHeight <= alternateLayout.maxDim
        ) {
          indexResult = pKey;
        }
        break;
      default:
        break;
    }
  }, alternateLayouts);

  return indexResult;
};
const getAlternateLayoutsSelector = state =>
  (state && state.alternateLayouts) || null;
const getRealDimmensionSelector = state =>
  (state && state.designAndGo && state.designAndGo.realDimension) || null;

const getRightAlternateLayoutSelector = createSelector(
  [getAlternateLayoutsSelector, getRealDimmensionSelector],
  (alternateLayouts, realDimensions) => {
    let clientPageWidth = realDimensions.width,
      clientPageHeight = realDimensions.height,
      indexResult = getCorrectAlternateLayoutIndex(
        alternateLayouts,
        clientPageWidth,
        clientPageHeight
      );
    if (indexResult == -1) {
      return null;
    }
    return alternateLayouts[indexResult];
  }
);

module.exports = {
  getAlternateLayoutsSelector,
  getRealDimmensionSelector,
  getRightAlternateLayoutSelector
};
