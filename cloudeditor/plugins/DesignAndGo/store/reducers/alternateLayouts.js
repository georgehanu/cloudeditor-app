//const Types = require("../../components/DesignAndGoConfig/types");
const uuidv4 = require("uuid/v4");

const { handleActions } = require("redux-actions");

const { forEach, toUpper } = require("ramda");
const { mmToPx } = require("../../../../core/utils/GlobalUtils");
const { GET_ALTERNATE_LAYOUT } = require("../actionTypes/alternateLayouts");
const initialState = [
  {
    id: uuidv4(),
    title: "Layout 1",
    rangeBy: "width",
    minDim: 100,
    maxDim: 1000,
    pages: [{}]
    //pages: ProjectUtils.getDGAlternateLayoutPages()
  }
];
const getAlternateLayout = (alternateLayouts, payload) => {
  let compareBy = payload.rangeBy,
    indexResult = -1,
    clientPageWidth = mmToPx(payload.width),
    clientPageHeight = mmToPx(payload.height);
  forEach((alternateLayout, pKey) => {
    switch (toUpper(compareBy)) {
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
  if (indexResult != -1) {
    return alternateLayouts[indexResult];
  }
  return null;
};
module.exports = handleActions(
  //export default handleActions(
  {
    [GET_ALTERNATE_LAYOUT]: (state, action) => {
      return getAlternateLayout(state, action.playload);
    }
  },
  initialState
);
