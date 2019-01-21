const { pathOr } = require("ramda");
const {
  createDeepEqualSelector: createSelector
} = require("../../rewrites/reselect/createSelector");

const { activePageIdSelector, pagesOrderSelector } = require("./project");

const assetsLayoutLoadingSelector = state =>
  pathOr(false, ["assets", "layout", "loading"], state);

const assetsLayoutSelector = state =>
  pathOr([], ["assets", "layout", "items"], state);

const assetsLayoutForActivePageSelector = createSelector(
  [activePageIdSelector, pagesOrderSelector, assetsLayoutSelector],
  (activePageId, pagesOrder, assetsLayout) => {
    const pageNo = pagesOrder.findIndex(el => {
      return el === activePageId;
    });

    const layouts = assetsLayout.filter((el, index) => {
      return parseInt(el.page_no, 10) === parseInt(pageNo, 10);
    });

    return layouts;
  }
);

module.exports = {
  assetsLayoutLoadingSelector,
  assetsLayoutSelector,
  assetsLayoutForActivePageSelector
};
