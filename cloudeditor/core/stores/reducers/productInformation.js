const { handleActions } = require("redux-actions");
const ProjectUtils = require("../../utils/ProjectUtils");
const ConfigUtils = require("../../utils/ConfigUtils");
const config = ConfigUtils.getDefaults();

const initialState = ProjectUtils.getEmptyProductInformation(
  config.productInformation
);
const {
  CALCULATE_PRICE,
  CALCULATE_PRICE_INITIAL,
  CHANGE_OPTIONS,
  START_CHANGE_PRINT_OPTIONS,
  STOP_CHANGE_PRINT_OPTIONS
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

const changeOptions = (state, payload) => {
  const print_options = { ...state.productOptions.print_options };
  let { qty } = state;
  if (payload.code === "quantity") {
    const splitVals = payload.value.split("_");
    if (splitVals.length === 2) {
      qty = parseInt(splitVals[1]);
    }
  } else {
    print_options[state.contentCode][payload.code][0] = payload.value;
    print_options[state.coverCode][payload.code][0] = payload.value;
  }
  return {
    ...state,
    qty,
    productOptions: {
      ...state.productOptions,
      print_options: print_options
    }
  };
};
const startChangePrintOption = (state, payload) => {
  return {
    ...state
  };
};
const stopChangePrintOptions = (state, payload) => {
  const { print_options, relatedProducts, relatedProductsInfo } = payload;
  return {
    ...state,
    relatedProducts: relatedProducts,
    relatedProductsInfo: [...relatedProductsInfo],
    productOptions: { ...state.productOptions, print_options: print_options }
  };
};

module.exports = handleActions(
  {
    [CALCULATE_PRICE]: (state, action) => {
      return calculatePrice(state, action);
    },
    [CALCULATE_PRICE_INITIAL]: (state, action) => {
      return calculatePriceInital(state, action.payload);
    },
    [CHANGE_OPTIONS]: (state, action) => {
      return changeOptions(state, action.payload);
    },
    [START_CHANGE_PRINT_OPTIONS]: (state, action) => {
      return startChangePrintOption(state, action.payload);
    },
    [STOP_CHANGE_PRINT_OPTIONS]: (state, action) => {
      return stopChangePrintOptions(state, action.payload);
    }
  },
  initialState
);
