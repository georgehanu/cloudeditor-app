const { handleActions } = require("redux-actions");
const ProjectUtils = require("../../utils/ProjectUtils");
const ConfigUtils = require("../../utils/ConfigUtils");
const config = ConfigUtils.getDefaults();

const initialState = ProjectUtils.getEmptyProductInformation(
  config.productInformation
);
const {
  CALCULATE_PRICE,
  CALCULATE_PRICE_INITIAL
} = require("../actionTypes/productInformation");
const calculatePrice = (state, payload) => {
  return {
    ...state,
    total_price: payload.total_price,
    productOptions: {
      ...state.productOptions,
      print_options: payload.print_options
    }
  };
};
const calculatePriceInital = (state, payload) => {
  return {
    ...state,
    total_price: payload.total_price
  };
};
module.exports = handleActions(
  {
    [CALCULATE_PRICE]: (state, action) => {
      return calculatePrice(state, action);
    },
    [CALCULATE_PRICE_INITIAL]: (state, action) => {
      return calculatePriceInital(state, action.payload);
    }
  },
  initialState
);
