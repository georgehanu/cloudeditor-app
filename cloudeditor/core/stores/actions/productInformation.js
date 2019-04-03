const {
  CALCULATE_PRICE,
  CALCULATE_PRICE_INITIAL,
  CHANGE_OPTIONS,
  START_CHANGE_PRINT_OPTIONS,
  STOP_CHANGE_PRINT_OPTIONS
} = require("../actionTypes/productInformation");
const { createActions } = require("redux-actions");
const {
  calculatePrice,
  calculatePriceInitial,
  changeOptions,
  startChangePrintOptions,
  stopChangePrintOptions
} = createActions(
  CALCULATE_PRICE,
  CALCULATE_PRICE_INITIAL,
  CHANGE_OPTIONS,
  START_CHANGE_PRINT_OPTIONS,
  STOP_CHANGE_PRINT_OPTIONS
);
module.exports = {
  calculatePrice,
  calculatePriceInitial,
  changeOptions,
  startChangePrintOptions,
  stopChangePrintOptions
};
