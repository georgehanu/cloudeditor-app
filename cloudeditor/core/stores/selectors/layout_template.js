const { pathOr, filter, values, includes, head } = require("ramda");
const { default: createCachedSelector } = require("re-reselect");
const {
  createDeepEqualSelector: createSelector
} = require("../../rewrites/reselect/createSelector");
const checkedSelector = state =>
  pathOr(false, ["layoutTemplate", "duplicateChecked"], state);

const isDefaultPoptextSelector = state =>
  pathOr(false, ["layoutTemplate", "isDefaultPoptext"], state);

const projectPagePoptextSelector = state =>
  pathOr(false, ["layoutTemplate", "projectPagePoptext"], state);

const projectCategoryPoptextSelector = state =>
  pathOr(false, ["layoutTemplate", "projectCategoryPoptext"], state);

const projectStatusPoptextSelector = state =>
  pathOr(false, ["layoutTemplate", "projectStatusPoptext"], state);

const projectTitleSelector = state =>
  pathOr("", ["layoutTemplate", "projectTitle"], state);

const templateIdSelector = state =>
  pathOr(0, ["layoutTemplate", "template_id"], state);
const projectIdSelector = state => pathOr(0, ["layoutTemplate", "id"], state);

const projectDescriptionSelector = state =>
  pathOr("", ["layoutTemplate", "projectDescription"], state);

const projectOrderSelector = state =>
  pathOr("", ["layoutTemplate", "projectOrder"], state);

const projectIconSelector = state =>
  pathOr(null, ["layoutTemplate", "projectIcon"], state);

const projectIconSrcSelector = state =>
  pathOr(null, ["layoutTemplate", "projectIconSrc"], state);

const projectLoadingSelector = state =>
  pathOr(false, ["layoutTemplate", "loading"], state);

const projectShowAlertSelector = state =>
  pathOr(false, ["layoutTemplate", "showAlert"], state);

const projectMessageSelector = state =>
  pathOr("", ["layoutTemplate", "message"], state);

const getCheckedDuplicateSelector = createSelector(
  checkedSelector,
  checked => {
    return checked;
  }
);

const getIsDefaultPoptextSelector = createSelector(
  isDefaultPoptextSelector,
  isDefaultPoptext => {
    return isDefaultPoptext;
  }
);

const getProjectPagePoptextSelector = createSelector(
  projectPagePoptextSelector,
  projectPagePoptext => {
    return projectPagePoptext;
  }
);

const getProjectCategoryPoptextSelector = createSelector(
  projectCategoryPoptextSelector,
  projectCategoryPoptext => {
    return projectCategoryPoptext;
  }
);

const getProjectStatusPoptextSelector = createSelector(
  projectStatusPoptextSelector,
  projectStatusPoptext => {
    return projectStatusPoptext;
  }
);

module.exports = {
  getCheckedDuplicateSelector,
  getIsDefaultPoptextSelector,
  getProjectPagePoptextSelector,
  getProjectCategoryPoptextSelector,
  getProjectStatusPoptextSelector,
  projectTitleSelector,
  projectDescriptionSelector,
  projectOrderSelector,
  projectIconSelector,
  projectIconSrcSelector,
  projectLoadingSelector,
  projectShowAlertSelector,
  projectMessageSelector,
  projectIdSelector,
  templateIdSelector
};
