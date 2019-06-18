const { registerSelectors } = require("reselect-tools");
const {
  createDeepEqualSelector: createSelector
} = require("../../rewrites/reselect/createSelector");

const { pathOr } = require("ramda");

const getProductNameSelector = state =>
  pathOr("", ["productInformation", "name"], state);

const getTotalPriceSelector = state =>
  pathOr("", ["productInformation", "total_price"], state);

const getQtySelector = state => pathOr(1, ["productInformation", "qty"], state);
const getPrintOptionsSelector = state =>
  pathOr({}, ["productInformation", "productOptions", "print_options"], state);
const getContentCode = state =>
  pathOr("", ["productInformation", "contentCode"], state);
const displyedOptionsSelector = state =>
  pathOr({}, ["productInformation", "displayedOptions"], state);

const getProductIdSelector = state =>
  pathOr("", ["productInformation", "productId"], state);
const getProductInformationSelector = state => state.productInformation;

module.exports = {
  getProductNameSelector,
  getQtySelector,
  getProductIdSelector,
  getTotalPriceSelector,
  getProductInformationSelector,
  displyedOptionsSelector,
  getPrintOptionsSelector,
  getContentCode
};
