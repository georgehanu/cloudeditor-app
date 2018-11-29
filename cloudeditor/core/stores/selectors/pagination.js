const {
  createSelectorWithDependencies: createSelector
} = require("reselect-tools");
const {
  head,
  last,
  init,
  remove,
  splitEvery,
  forEach,
  forEachObjIndexed,
  append,
  pick
} = require("ramda");
const {
  pagesSelector,
  selectedPageIdSelector,
  objectsSelector,
  groupsSelector
} = require("./project");

const paginationPagesSelector = createSelector(
  [groupsSelector, objectsSelector, pagesSelector, selectedPageIdSelector],
  (groups, allObjects, pages, selectedPageId) => {
    let pagesIds = [];

    forEachObjIndexed((group, group_key) => {
      let paginationGroup = [];
      forEach(pageId => {
        const page = pages[pageId];
        const pageObjectsIds = page["objectsIds"];
        const pageObjects = pick(pageObjectsIds, allObjects);
        const active = pageId == selectedPageId ? true : false;
        paginationGroup.push([
          {
            id: pageId,
            active: active,
            page: { objects: pageObjects, ...pages[pageId] },
            group_id: group_key
          }
        ]);
      }, group);
      pagesIds.push(paginationGroup);
    }, groups);

    return { pagesIds };
  }
);

module.exports = {
  paginationPagesSelector
};
