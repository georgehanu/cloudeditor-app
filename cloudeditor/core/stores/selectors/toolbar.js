const {
  createSelectorWithDependencies: createSelector
} = require("reselect-tools");
const { pick, mergeAll, merge } = require("ramda");

const {
  objectsSelector,
  selectedObjectsIdsSelector,
  objectsDefaultConfigSelector,
  pagesSelector,
  activePageIdSelector,
  headerEnabledSelector,
  footerEnabledSelector
} = require("./project");

const selectedObjectToolbarSelector = createSelector(
  [objectsSelector, selectedObjectsIdsSelector, objectsDefaultConfigSelector],
  (objects, selectedObjectsIds, defaults) => {
    if (selectedObjectsIds.length === 0) {
      return null;
    }

    const selectedObj = pick(selectedObjectsIds, objects);
    const selectedItem = selectedObj[Object.keys(selectedObj)[0]];
    return merge(
      merge(defaults.generalCfg, defaults[selectedItem.subType + "Cfg"]),
      selectedItem
    );
    return mergeAll(
      defaults.generalCfg,
      defaults[selectedItem.subType + "Cfg"],
      selectedItem
    );
  }
);

const selectedObjectLayerSelector = createSelector(
  [
    pagesSelector,
    activePageIdSelector,
    selectedObjectsIdsSelector,
    headerEnabledSelector,
    footerEnabledSelector,
    objectsSelector
  ],
  (pages, pageId, selectedObj, headerEnabeld, footerEnabled, objects) => {
    let objIds = {};
    if (headerEnabeld || footerEnabled) {
      const type = headerEnabeld ? "header" : "footer";
      objIds = objects[type].objectsIds;
    } else {
      objIds = pages[pageId].objectsIds;
    }
    const objIndex = objIds.findIndex(el => {
      return el === selectedObj[Object.keys(selectedObj)[0]];
    });

    if (selectedObj.length === 0) {
      return {};
    }

    let availableLayer = {};
    if (objIndex === 0) {
      availableLayer["back"] = false;
    }
    if (objIndex === objIds.length - 1) {
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
const uiPageOffsetSelector = createSelector(
  [uiSelector],
  ui => {
    return ui.workArea;
  }
);
const uiScaleSelector = createSelector(
  [uiSelector],
  ui => {
    return ui.workArea.scale;
  }
);
const uiFullHeightSelector = createSelector(
  [uiSelector],
  ui => {
    return ui.workArea.canvas.fullHeight;
  }
);
const uiFullWidthSelector = createSelector(
  [uiSelector],
  ui => {
    return ui.workArea.canvas.fullWidth;
  }
);
const uiZoomSelector = createSelector(
  [uiSelector],
  ui => {
    return ui.workArea.zoom;
  }
);
const uiViewportTransformSelector = createSelector(
  [uiSelector],
  ui => {
    return ui.workArea.viewportTransform;
  }
);
/*Start Toolbar base selectors*/
const targetPositionSelector = state => {
  return state.toolbar.targetPosition;
};
/*End Toolbar base selectors*/

module.exports = {
  selectedObjectToolbarSelector,
  selectedObjectLayerSelector,
  selectedPageDimmensionsSelector,
  uiPageOffsetSelector,
  uiScaleSelector,
  uiFullHeightSelector,
  uiFullWidthSelector,
  uiZoomSelector,
  uiViewportTransformSelector,
  targetPositionSelector
};
