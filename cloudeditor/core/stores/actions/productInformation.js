const {
  CALCULATE_PRICE,
  CALCULATE_PRICE_INITIAL
} = require("../actionTypes/productInformation");
const { createActions } = require("redux-actions");
const { calculatePrice, calculatePriceInitial } = createActions(
  CALCULATE_PRICE,
  CALCULATE_PRICE_INITIAL
);
module.exports = {
  calculatePrice,
  calculatePriceInitial
};
