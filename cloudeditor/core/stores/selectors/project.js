/* const {
  createSelectorWithDependencies: createSelector
} = require("reselect-tools"); */
const {
  createDeepEqualSelector: createSelector
} = require("../../rewrites/reselect/createSelector");
const {
  pick,
  merge,
  forEachObjIndexed,
  pipe,
  assocPath,
  takeLast,
  head,
  keys,
  forEach,
  pathOr
} = require("ramda");

const pagesSelector = state => {
  return pathOr({}, ["project", "pages"], state);
};

const pagesOrderSelector = state => {
  return pathOr([], ["project", "pagesOrder"], state);
};

const activePageIdSelector = state =>
  pathOr(null, ["project", "activePage"], state);

const titleSelector = state =>
  pathOr("Empty project", ["project", "title"], state);

/* Start Document Config Selectors */

const displayOnePageSelector = state => {
  return pathOr(
    false,
    ["project", "configs", "document", "displayOnePage"],
    state
  );
};
const facingPagesSelector = state => {
  return pathOr(
    false,
    ["project", "configs", "document", "facingPages"],
    state
  );
};
const singleFirstLastPageSelector = state => {
  return pathOr(
    false,
    ["project", "configs", "document", "singleFirstLastPage"],
    state
  );
};
const groupSizeSelector = state => {
  return pathOr(false, ["project", "configs", "document", "groupSize"], state);
};
const predefinedGroupsSelector = state => {
  return pathOr(
    false,
    ["project", "configs", "document", "predefinedGroups"],
    state
  );
};
const includeBoxesSelector = state => {
  return pathOr(
    false,
    ["project", "configs", "document", "includeBoxes"],
    state
  );
};
const useMagneticSelector = state => {
  return pathOr(
    false,
    ["project", "configs", "document", "useMagentic"],
    state
  );
};
const showTrimboxSelector = state => {
  return pathOr(
    false,
    ["project", "configs", "document", "showTrimbox"],
    state
  );
};

const headerConfigSelector = state => {
  return pathOr(false, ["project", "configs", "document", "header"], state);
};

const footerConfigSelector = state => {
  return pathOr(false, ["project", "configs", "document", "footer"], state);
};
/* End Document Config Selectors */

/* Start Pages Config Selectors */
const pagesDefaultConfigSelector = state => {
  return pathOr(false, ["project", "configs", "pages", "default"], state);
};
const trimboxPagesConfigSelector = state => {
  return pathOr(
    { top: 0, right: 0, bottom: 0, left: 0 },
    ["project", "configs", "pages", "boxes", "trimbox"],
    state
  );
};
const bleedPagesConfigSelector = state => {
  return pathOr(
    { top: 0, right: 0, bottom: 0, left: 0 },
    ["project", "configs", "pages", "boxes", "bleed"],
    state
  );
};
const tolerancePagesConfigSelector = state => {
  return pathOr(0, ["project", "configs", "pages", "tolerance"], state);
};
const blockActionsPagesConfigSelector = state => {
  return pathOr({}, ["project", "configs", "pages", "blockActions"], state);
};
const deletePagePagesConfigSelector = state => {
  return pathOr(0, ["project", "configs", "pages", "allowDeletePage"], state);
};
/* End Pages Config Selectors */
/* Start Objects Config Selectors */
const objectsDefaultConfigSelector = state => {
  return pathOr(false, ["project", "configs", "objects"], state);
};
/* End Objects Config Selectors */

const groupsSelector = state => {
  return pathOr({}, ["project", "configs", "document", "groups"], state);
};

const objectsSelectorSelector = state => {
  return (state && state.project && state.project.objects) || {};
};

const objectsSelector = createSelector(
  objectsSelectorSelector,
  objects => {
    return objects;
  }
);

const selectedPageIdSelector = state =>
  (state && state.project && state.project.selectedPage) || null;
const activeGroupIdSelector = state =>
  (state && state.project && state.project.activeGroup) || null;

const selectedObjectsIdsSelector = state =>
  (state && state.project && state.project.selectedObjectsIds) || [];

const selectedActionsIdsSelector = state =>
  (state && state.project && state.project.selectedActionObjectsIds) || [];

const activeSelectionSelector = state =>
  (state && state.project && state.project.activeSelection) || null;
let getObjectsInGroup = (pageObjectsIds, allObjects, activePage) => {
  let result = {};
  result = pick(pageObjectsIds, allObjects);
  forEachObjIndexed(obj => {
    if (obj.type === "group") {
      obj._elements = getObjectsInGroup(
        obj._objectsIds,
        allObjects,
        activePage
      );
    }
    obj.offsetLeft = activePage.width;
    obj.offsetTop = activePage.height;
  }, result);
  return result;
};
const documentBoxesSelector = state =>
  (state && state.project.configs.pages && state.project.configs.pages.boxes) ||
  {};

const getPagesWithObjects = (
  activeGroupPages,
  pages,
  objects,
  useTrimbox,
  boxes,
  activeGroupId,
  selectedPageId
) => {
  let activePage = {
    id: activeGroupId,
    width: useTrimbox ? boxes["trimbox"]["left"] : 0,
    height: useTrimbox ? boxes["trimbox"]["top"] : 0,
    overlays: [],
    objects: {}
  };
  let left = 0;
  let initialWidth = activePage.width;
  const lastPageId = takeLast(1, activeGroupPages);
  const lastPage = pages[lastPageId];
  forEach(currentPageId => {
    const page = pages[currentPageId];
    let pageObjects = {};

    pageObjects = merge(
      pageObjects,
      getObjectsInGroup(page.objectsIds, objects, activePage)
    );
    activePage = {
      id: activeGroupId,
      width: activePage.width + page.width,
      height: activePage.height,
      objects: merge(activePage.objects, pageObjects),
      overlays: activePage.overlays
    };
    if (currentPageId !== selectedPageId) {
      const overlay = {
        group_id: activeGroupId,
        id: currentPageId,
        left: left,
        height: useTrimbox
          ? boxes["trimbox"]["top"] + lastPage.height + activePage.height
          : lastPage.height + activePage.height,
        width:
          lastPageId === currentPageId && useTrimbox
            ? page.width + boxes["trimbox"]["right"]
            : page.width + initialWidth
      };
      activePage.overlays.push(overlay);
    }
    left = activePage.width;
    initialWidth = 0;
  }, activeGroupPages);
  activePage.width += useTrimbox ? boxes["trimbox"]["right"] : 0;
  activePage.height += useTrimbox
    ? boxes["trimbox"]["top"] + lastPage.height
    : lastPage.height;

  return activePage;
};

const activePageSelector = createSelector(
  [
    pagesSelector,
    objectsSelector,
    selectedObjectsIdsSelector,
    selectedActionsIdsSelector,
    activeGroupIdSelector,
    groupsSelector,
    documentBoxesSelector,
    selectedPageIdSelector
  ],
  (
    pages,
    objects,
    selectedObejectsIds,
    selectedObjectsAction,
    activeGroupId,
    groups,
    boxes,
    useTrimbox,
    selectedPageId
  ) => {
    const activeGroupPages = groups[activeGroupId];
    let activeObject = pick(selectedObejectsIds, objects);
    const activeObjectKey = pipe(
      keys,
      head
    )(activeObject);
    activeObject = assocPath([activeObjectKey, "active"], true, activeObject);
    objects = merge(objects, activeObject);
    let selecteObject = pick(selectedObjectsAction, objects);
    const selectedObjectKey = pipe(
      keys,
      head
    )(selecteObject);
    selecteObject = assocPath(
      [selectedObjectKey, "selected"],
      true,
      selecteObject
    );

    objects = merge(objects, selecteObject);
    const activePage = getPagesWithObjects(
      activeGroupPages,
      pages,
      objects,
      useTrimbox,
      boxes,
      activeGroupId,
      selectedPageId
    );
    return activePage;
  }
);
const selectedObjectSelector = createSelector(
  [objectsSelector, selectedObjectsIdsSelector],
  (objects, selectedObjectsIds) => {
    selectedObjectsIds = [Object.keys(objects)[0]];

    const activeObjects = {
      objects: pick(selectedObjectsIds, objects)
    };

    return activeObjects;
  }
);

const projDescriptionSelector = state =>
  pathOr("Project description", ["project", "description"], state);

const projProjectIdSelector = state =>
  pathOr(null, ["project", "projectId"], state);

const projSaveLoadingSelector = state =>
  pathOr(false, ["project", "save", "loading"], state);

const projSaveErrorMessageSelector = state =>
  pathOr(null, ["project", "save", "errorMessage"], state);

const projLoadLoadingSelector = state =>
  pathOr(false, ["project", "load", "loading"], state);

const projLoadErrorMessageSelector = state =>
  pathOr(null, ["project", "load", "errorMessage"], state);

const projLoadLoadedProjectsSelector = state =>
  pathOr(null, ["project", "load", "loadedProjects"], state);

module.exports = {
  pagesSelector,
  pagesOrderSelector,
  activePageIdSelector,
  activePageSelector,
  selectedObjectSelector,
  activeSelectionSelector,
  objectsSelector,
  selectedActionsIdsSelector,
  selectedObjectsIdsSelector,
  groupsSelector,
  selectedPageIdSelector,

  displayOnePageSelector,
  facingPagesSelector,
  singleFirstLastPageSelector,
  groupSizeSelector,
  predefinedGroupsSelector,
  includeBoxesSelector,
  useMagneticSelector,
  showTrimboxSelector,
  headerConfigSelector,
  footerConfigSelector,
  pagesDefaultConfigSelector,
  trimboxPagesConfigSelector,
  bleedPagesConfigSelector,
  tolerancePagesConfigSelector,
  objectsDefaultConfigSelector,
  titleSelector,
  blockActionsPagesConfigSelector,
  deletePagePagesConfigSelector,
  projDescriptionSelector,
  projProjectIdSelector,
  projSaveLoadingSelector,
  projSaveErrorMessageSelector,
  projLoadLoadingSelector,
  projLoadErrorMessageSelector,
  projLoadLoadedProjectsSelector
};
