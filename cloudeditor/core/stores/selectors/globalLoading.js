const { pathOr, filter, values, includes, head } = require("ramda");
const { default: createCachedSelector } = require("re-reselect");
const {
  createDeepEqualSelector: createSelector
} = require("../../rewrites/reselect/createSelector");

const getLoadingStatusSelector = state => state.globalLoading.loading;
const getEnabledStatusSelector = state => state.globalLoading.enabled;

module.exports = { getLoadingStatusSelector, getEnabledStatusSelector };
