const {
  CALCULATE_PRICE,
  CALCULATE_PRICE_INITIAL,
  CHANGE_OPTIONS
} = require("../actionTypes/productInformation");
const { createActions } = require("redux-actions");
const { calculatePrice, calculatePriceInitial, changeOptions } = createActions(
  CALCULATE_PRICE,
  CALCULATE_PRICE_INITIAL,
  CHANGE_OPTIONS
);
module.exports = {
  calculatePrice,
  calculatePriceInitial,
  changeOptions
};
