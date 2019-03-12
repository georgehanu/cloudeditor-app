const { forEachObjIndexed, toUpper } = require("ramda");

const getAlternateLayoutIndex = (
  allAlternateLayouts,
  realWidthDimmension,
  realHeightDimmension
) => {
  let indexResult = -1;
  if (allAlternateLayouts.length) {
    forEachObjIndexed((alternateLayout, pKey) => {
      switch (toUpper(alternateLayout.rangeBy)) {
        case "WIDTH":
          if (
            realWidthDimmension >= alternateLayout.minDim &&
            realWidthDimmension <= alternateLayout.maxDim
          ) {
            indexResult = pKey;
          }
          break;
        case "HEIGHT":
          if (
            realHeightDimmension >= alternateLayout.minDim &&
            realHeightDimmension <= alternateLayout.maxDim
          ) {
            indexResult = pKey;
          }
          break;
        case "BOTH":
          if (
            realHeightDimmension >= alternateLayout.minDim &&
            realHeightDimmension <= alternateLayout.maxDim &&
            realWidthDimmension >= alternateLayout.minDim &&
            realWidthDimmension <= alternateLayout.maxDim
          ) {
            indexResult = pKey;
          }
          break;
        default:
          break;
      }
    }, allAlternateLayouts);
  }
  return indexResult;
};

module.exports = { getAlternateLayoutIndex };
