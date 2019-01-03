const { pathOr } = require("ramda");

const titleSelector = state => {
  console.log("titleSelector");
  return pathOr("", ["project", "title"], state);
};

const pagesSelector = state => {
  return pathOr({}, ["project", "pages"], state);
};

const activePageSelector = state =>
  pathOr(null, ["project", "activePage"], state);

const pagesOrderSelector = state => {
  return pathOr([], ["project", "pagesOrder"], state);
};

const objectsSelector = state => {
  return pathOr({}, ["project", "objecst"], state);
};

const globalObjectsIdsSelector = state => {
  return pathOr(
    { before: [], after: [] },
    ["project", "globalObjectsIds"],
    state
  );
};
const selectedObjectsIdsSelector = state => {
  return pathOr([], ["project", "selectedObjectsIds"], state);
};
const configsSelector = state => {
  return pathOr({}, ["project", "configsSelector"], state);
};

module.exports = {
  titleSelector,
  pagesSelector,
  activePageSelector,
  pagesOrderSelector,
  objectsSelector,
  globalObjectsIdsSelector,
  selectedObjectsIdsSelector,
  configsSelector
};
