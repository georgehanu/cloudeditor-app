const { pathOr, filter, values, includes, head } = require("ramda");
const { default: createCachedSelector } = require("re-reselect");
const {
  createDeepEqualSelector: createSelector
} = require("../../rewrites/reselect/createSelector");
const checkedSelector = state =>
  pathOr(false, ["layoutTemplate", "duplicateChecked"], state);

const getCheckedDuplicateSelector = createSelector(
  checkedSelector,
  checked => {
    return checked;
  }
);

module.exports = {
  getCheckedDuplicateSelector
};
