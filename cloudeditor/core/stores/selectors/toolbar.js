const {
  createSelectorWithDependencies: createSelector
} = require("reselect-tools");

const { pick } = require("ramda");

const {
  objectsSelector,
  selectedObjectsIdsSelector,
  pagesSelector,
  activePageIdSelector
} = require("./project");

const selectedObjectToolbarSelector = createSelector(
  [objectsSelector, selectedObjectsIdsSelector],
  (objects, selectedObjectsIds) => {
    if (selectedObjectsIds.length === 0) {
      return null;
    }

    const selectedObj = pick(selectedObjectsIds, objects);
    const selectedItem = selectedObj[Object.keys(selectedObj)[0]];

    return selectedItem;
  }
);

const selectedObjectLayerSelector = createSelector(
  [pagesSelector, activePageIdSelector, selectedObjectsIdsSelector],
  (pages, pageId, selectedObj) => {
    if (selectedObj.length === 0) {
      return {};
    }

    const page = pages[pageId];
    const objIndex = page.objectsIds.findIndex(el => {
      return el === selectedObj[Object.keys(selectedObj)[0]];
    });
    let availableLayer = {};
    if (objIndex === 0) {
      availableLayer["back"] = false;
    }
    if (objIndex === page.objectsIds.length - 1) {
      availableLayer["front"] = false;
    }

    return availableLayer;
  }
);
const selectedPageDimmensionsSelector = createSelector(
  [pagesSelector, activePageIdSelector],
  (pages, pageId) => {
    return {
      pageWidth: pages[pageId].width,
      pageHeight: pages[pageId].height
    };
  }
);

const uiSelector = state => (state && state.ui) || {};
const uiPageOffsetSelector = createSelector([uiSelector], ui => {
  return ui.workArea;
});
const uiScaleSelector = createSelector([uiSelector], ui => {
  return ui.workArea.scale;
});
const uiFullHeightSelector = createSelector([uiSelector], ui => {
  return ui.workArea.canvas.fullHeight;
});
const uiFullWidthSelector = createSelector([uiSelector], ui => {
  return ui.workArea.canvas.fullWidth;
});
const uiZoomSelector = createSelector([uiSelector], ui => {
  return ui.workArea.zoom;
});
const uiViewportTransformSelector = createSelector([uiSelector], ui => {
  return ui.workArea.viewportTransform;
});

module.exports = {
  selectedObjectToolbarSelector,
  selectedObjectLayerSelector,
  selectedPageDimmensionsSelector,
  uiPageOffsetSelector,
  uiScaleSelector,
  uiFullHeightSelector,
  uiFullWidthSelector,
  uiZoomSelector,
  uiViewportTransformSelector
};
