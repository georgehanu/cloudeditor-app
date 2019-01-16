const { registerSelectors } = require("reselect-tools");
const {
  createDeepEqualSelector: createSelector
} = require("../../rewrites/reselect/createSelector");

const { pathOr } = require("ramda");

const getProductNameSelector = state =>
  pathOr("", ["productInformation", "name"], state);
const getQtySelector = state => pathOr(1, ["productInformation", "qty"], state);

const getProductIdSelector = state =>
  pathOr("", ["productInformation", "productId"], state);

module.exports = {
  getProductNameSelector,
  getQtySelector,
  getProductIdSelector
};
