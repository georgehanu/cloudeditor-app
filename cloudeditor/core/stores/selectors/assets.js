const { pathOr } = require("ramda");
const {
  createDeepEqualSelector: createSelector
} = require("../../rewrites/reselect/createSelector");

const { activePageIdSelector, pagesOrderSelector } = require("./project");

const assetsLayoutLoadingSelector = state =>
  pathOr(false, ["assets", "layout", "loading"], state);

const assetsLayoutSelector = state =>
  pathOr([], ["assets", "layout", "items"], state);
const categoriesSelector = state =>
  pathOr([], ["assets", "layout", "categories"], state);

const selectCategory = (_, props) => props.category_id;

const assetsLayoutForActivePageSelector = createSelector(
  [
    activePageIdSelector,
    pagesOrderSelector,
    assetsLayoutSelector,
    selectCategory
  ],
  (activePageId, pagesOrder, assetsLayout, category_id) => {
    const layouts = assetsLayout.filter((el, index) => {
      return (
        (el.page_id === activePageId || el.page_id === "*") &&
        parseInt(el.category_id, 10) === parseInt(category_id, 10)
      );
    });

    return layouts;
  }
);

module.exports = {
  assetsLayoutLoadingSelector,
  assetsLayoutSelector,
  assetsLayoutForActivePageSelector,
  categoriesSelector
};
