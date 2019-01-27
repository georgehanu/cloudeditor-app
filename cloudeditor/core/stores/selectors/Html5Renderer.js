const { registerSelectors } = require("reselect-tools");
const {
  createDeepEqualSelector: createSelector
} = require("../../rewrites/reselect/createSelector");

const createCachedSelector = require("re-reselect").default;

const hasPageHeaderFooter = function(innerPage, config) {
  if (config.enabled) {
    if (config.activeOn === "all") return true;
    if (config.activeOn === "inner") {
      if (!(innerPage.isDocumentFirstPage || innerPage.isDocumentLastPage))
        return true;
    }
  }
  return false;
};

const {
  head,
  any,
  flatten,
  forEach,
  merge,
  pathOr,
  pluck,
  pick,
  values,
  compose,
  last,
  apply,
  lensPath,
  set,
  view,
  mergeAll,
  forEachObjIndexed,
  clone,
  mergeDeepLeft
} = require("ramda");

const {
  pagesSelector,
  pagesOrderSelector,
  activePageIdSelector,
  displayOnePageSelector,
  singleFirstLastPageSelector,
  groupSizeSelector,
  predefinedGroupsSelector,
  pagesDefaultConfigSelector,
  trimboxPagesConfigSelector,
  bleedPagesConfigSelector,
  safeCutPagesConfigSelector,
  objectsDefaultConfigSelector,
  blockActionsPagesConfigSelector,
  deletePagePagesConfigSelector,
  showTrimboxSelector,
  headerConfigSelector,
  footerConfigSelector
} = require("./project");

const { getMaxProp, addProps } = require("../../utils/UtilUtils");

const totalPages = createSelector(
  pagesOrderSelector,
  pages => {
    return pages.length;
  }
);

const groupsSelector = facingPagesSelector =>
  createSelector(
    facingPagesSelector,
    singleFirstLastPageSelector,
    groupSizeSelector,
    predefinedGroupsSelector,
    pagesOrderSelector,
    (fp, sp, gs, pg, pagesOrder) => {
      //no facing pages return groups of one page [[page-1],[page-2]]
      const pages = [...pagesOrder];

      if (!fp) {
        return pages.map(page => {
          return [page];
        });
      } else {
        let groups = [];
        if (sp) {
          //first/last page must be single [[f-page],[group],...[group],[l-page]]
          groups.push([pages.shift()]);
        }

        let tmp = [];
        let counter = 0;
        let pgIndex = 0;
        let pgLength = pg ? pg.length : 0;

        while (pages.length >= 1) {
          counter++;
          tmp.push(pages.shift());
          if (pgIndex < pgLength) {
            if (counter === pg[pgIndex]) {
              pgIndex++;
              counter = 0;
              groups.push(tmp);
              tmp = [];
            }
          } else {
            if (counter === gs) {
              counter = 0;
              groups.push(tmp);
              tmp = [];
            }
          }
        }

        if (tmp.length) groups.push(tmp);
        return groups;
      }
    }
  );
const activeGroupSelector = groupsSelector =>
  createSelector(
    activePageIdSelector,
    groupsSelector,
    (pageId, groups) => {
      const result = groups.filter(group => {
        return any(page => {
          return pageId === page;
        })(group);
      });

      return flatten(result);
    }
  );

const displayedPageSelector = (
  displayOnePageSelector,
  groupSelector,
  activePageIdSelector,
  includeBoxesSelector,
  allowSafeCutSelector
) => {
  return createSelector(
    displayOnePageSelector,
    groupSelector,
    pagesSelector,
    pagesDefaultConfigSelector,
    includeBoxesSelector,
    allowSafeCutSelector,
    activePageIdSelector,
    pagesOrderSelector,
    deletePagePagesConfigSelector,
    showTrimboxSelector,
    headerConfigSelector,
    footerConfigSelector,
    (
      displayOnePage,
      group,
      pages,
      config,
      includeBoxes,
      allowSafeCut,
      activePageId,
      pagesOrder,
      allowDeletePage,
      showTrimbox,
      headerConfig,
      footerConfig
    ) => {
      const innerPages = {};
      const activePage = pages[activePageId];
      let nextPage = false;
      let nextGroup = false;
      let prevPage = false;
      let prevGroup = false;
      const currentPosition = pagesOrder.indexOf(activePageId);
      if (currentPosition + 2 <= pagesOrder.length) {
        nextPage = pagesOrder[currentPosition + 1];
      }
      if (currentPosition !== 0) {
        prevPage = pagesOrder[currentPosition - 1];
      }
      const currentFirstPagePosition = pagesOrder.indexOf(head(group));
      const currentLastPagePosition = pagesOrder.indexOf(last(group));
      if (currentLastPagePosition + 2 <= pagesOrder.length) {
        nextGroup = pagesOrder[currentLastPagePosition + 1];
      }
      if (currentFirstPagePosition !== 0) {
        prevGroup = pagesOrder[currentFirstPagePosition - 1];
      }
      const offset = { left: 0, top: 0 };
      let label = "";
      let selectable = true;
      let background = true;
      let lockPosition = true;
      let pagesLabels = [];

      const defaultBox = { top: 0, right: 0, bottom: 0, left: 0 };
      const addInnerPage = (page, groupIndex) => {
        innerPages[page] = mergeDeepLeft(pages[page], config);

        innerPages[page]["isDocumentFirstPage"] =
          pagesOrder.indexOf(page) === 0;
        innerPages[page]["isDocumentLastPage"] =
          pagesOrder.indexOf(page) === pagesOrder.length - 1;

        innerPages[page]["isGroupFirstPage"] =
          group.indexOf(page) === 0 && group.length > 1;
        innerPages[page]["isGroupLastPage"] =
          group.indexOf(page) === group.length - 1 && group.length > 1;
        innerPages[page]["isSinglePageGroup"] = group.length === 1;

        let pageTrimboxTolerance = 0;
        if (allowSafeCut) {
          pageTrimboxTolerance =
            innerPages[page]["boxes"]["trimbox"]["top"] * 2 +
            innerPages[page]["safeCut"];

          innerPages[page]["boxesMagentic"] = {
            magneticSnapEdge: { left: -1, top: -1, bottom: -1, right: -1 },
            magneticSnap: {
              left: pageTrimboxTolerance,
              top: pageTrimboxTolerance,
              bottom: pageTrimboxTolerance,
              right: pageTrimboxTolerance
            }
          };
        } else {
          innerPages[page]["8"] = {};
        }
        innerPages[page]["offset"] = { ...offset };
        innerPages[page]["snapTolerance"] = pageTrimboxTolerance;
        offset["left"] += innerPages[page]["width"];
        pagesLabels[page] = { left: innerPages[page]["width"] };
        label = innerPages[page]["label"];
        shortLabel = innerPages[page]["shortLabel"];
        lockPosition = innerPages[page]["lockPosition"];
        selectable = innerPages[page]["selectable"];
        background = innerPages[page]["background"];
      };

      for (let p = 0; p < group.length; p++) {
        if (displayOnePage) {
          if (group[p] === activePageId) {
            addInnerPage(activePageId, p);
            break;
          }
        } else {
          addInnerPage(group[p], p);
        }
      }

      forEachObjIndexed((innerPage, pKey) => {
        innerPages[pKey]["hasHeader"] = hasPageHeaderFooter(
          innerPage,
          headerConfig
        );
        innerPages[pKey]["hasFooter"] = hasPageHeaderFooter(
          innerPage,
          footerConfig
        );
      }, innerPages);

      let boxes = {};
      let magneticBoxes = {};

      const pagesBoxes = pluck("boxes", innerPages);
      const pagesBoxesMagnetic = pluck("boxesMagentic", innerPages);
      forEachObjIndexed((pageBoxes, pKey) => {
        Object.keys(pageBoxes).map(bKey => {
          boxes[bKey] = defaultBox;
          if (includeBoxes) {
            const box = compose(pluck(bKey))(pagesBoxes);
            boxes[bKey] = {
              top: compose(
                apply(Math.max),
                values,
                pluck("top")
              )(box),
              right: compose(
                last,
                values,
                pluck("right")
              )(box),
              bottom: compose(
                apply(Math.max),
                values,
                pluck("bottom")
              )(box),
              left: compose(
                head,
                values,
                pluck("top")
              )(box)
            };
          }
          return bKey;
        });
      }, pagesBoxes);
      if (allowSafeCut) {
        forEachObjIndexed((pageBoxesMagnetic, pKey) => {
          Object.keys(pageBoxesMagnetic).map(bKey => {
            magneticBoxes[bKey] = defaultBox;

            const box = compose(pluck(bKey))(pagesBoxesMagnetic);
            magneticBoxes[bKey] = {
              top: compose(
                apply(Math.max),
                values,
                pluck("top")
              )(box),
              right: compose(
                last,
                values,
                pluck("right")
              )(box),
              bottom: compose(
                apply(Math.max),
                values,
                pluck("bottom")
              )(box),
              left: compose(
                head,
                values,
                pluck("top")
              )(box)
            };
            return false;
          });
        }, pagesBoxesMagnetic);
      }

      return {
        width: addProps(
          innerPages,
          "width",
          includeBoxes
            ? getMaxProp(boxes, "left") + getMaxProp(boxes, "right")
            : 0
        ),
        height:
          getMaxProp(innerPages, "height") +
          (includeBoxes
            ? getMaxProp(boxes, "top") + getMaxProp(boxes, "bottom")
            : 0),
        snapTolerance: getMaxProp(innerPages, "snapTolerance"),
        boxes: showTrimbox ? boxes : {},
        magneticBoxes: magneticBoxes,
        lockPosition: lockPosition,
        background: background,
        page_id: activePageId,
        label: label,
        selectable: selectable,
        pagesLabels,
        nextPage,
        nextGroup,
        allowDeletePage: pathOr(
          allowDeletePage,
          ["allowDeletePage"],
          pages[head(group)]
        ),
        prevPage,
        prevGroup,
        offset: {
          left: includeBoxes ? getMaxProp(boxes, "left") : 0,
          top: includeBoxes ? getMaxProp(boxes, "top") : 0
        },
        innerPages,
        group: group
      };
    }
  );
};
const displayedPageLabelsSelector = pageIdSelector => {
  return createSelector(
    pageIdSelector,
    pagesOrderSelector,
    pagesSelector,
    (pageIdSelector, pageOrder, pages) => {
      let pageNumber = 1;
      let found = false;
      const page = pages[pageIdSelector];
      forEach(el => {
        if (el === pageIdSelector) {
          found = true;
        }
        if (el !== pageIdSelector && !found && pages[el]["countInPagination"]) {
          pageNumber++;
        }
      }, pageOrder);
      return {
        longLabel: page["label"].replace("%no%", pageNumber),
        shortLabel: page["shortLabel"].replace("%no%", pageNumber)
      };
    }
  );
};
const displayedPagesLabelsSelector = createSelector(
  pagesOrderSelector,
  pagesSelector,
  (pageOrder, pages) => {
    let pageNumber = 1;
    let labels = [];
    forEach(el => {
      const page = pages[el];

      labels[el] = {
        longLabel: page["label"].replace("%no%", pageNumber),
        shortLabel: page["shortLabel"].replace("%no%", pageNumber)
      };
      if (page["countInPagination"]) {
        pageNumber++;
      }
    }, pageOrder);
    return labels;
  }
);

const applyZoomScaleToTarget = (page, zoomScale, paths) => {
  let scaledPage = clone(page);

  forEach(path => {
    const lens = lensPath(path);
    const value = view(lens, scaledPage);
    scaledPage = set(lens, value * zoomScale, scaledPage);
  })(paths);

  return scaledPage;
};

const scaledDisplayedPageSelector = (
  displayedPageSelector,
  zoomScaleSelector
) => {
  return createSelector(
    displayedPageSelector,
    zoomScaleSelector,
    (page, zoomScale) => {
      let scaledPage = clone(page);
      if (zoomScale === 1) return scaledPage;

      const defaultPaths = [
        ["width"],
        ["height"],
        ["snapTolerance"],
        ["safeCut"],
        ["columnSpacing"],
        ["offset", "top"],
        ["offset", "left"],
        ["boxes", "trimbox", "top"],
        ["boxes", "trimbox", "right"],
        ["boxes", "trimbox", "bottom"],
        ["boxes", "trimbox", "left"],
        ["boxes", "bleed", "top"],
        ["boxes", "bleed", "right"],
        ["boxes", "bleed", "bottom"],
        ["boxes", "bleed", "left"],
        ["magneticBoxes", "magneticSnap", "top"],
        ["magneticBoxes", "magneticSnap", "right"],
        ["magneticBoxes", "magneticSnap", "bottom"],
        ["magneticBoxes", "magneticSnap", "left"]
      ];

      scaledPage = applyZoomScaleToTarget(scaledPage, zoomScale, defaultPaths);

      forEach(pageKey => {
        scaledPage.innerPages[pageKey] = applyZoomScaleToTarget(
          scaledPage.innerPages[pageKey],
          zoomScale,
          defaultPaths
        );
      }, Object.keys(page.innerPages));

      return scaledPage;
    }
  );
};
const displayedObjectSelector = blockSelector => {
  return createSelector(
    blockSelector,
    block => {
      return block;
    }
  );
};
const displayedMergedObjectSelector = (
  displayedObjectSelector,
  getActivePropSelector
) => {
  return createSelector(
    displayedObjectSelector,
    objectsDefaultConfigSelector,
    getActivePropSelector,
    (object, defaults, active) => {
      return mergeAll([
        defaults.generalCfg,
        defaults[object.subType + "Cfg"],
        object,
        {
          active
        }
      ]);
    }
  );
};

const scaledDisplayedObjectSelector = (
  displayedBlockSelector,
  zoomScaleSelector
) => {
  return createSelector(
    displayedBlockSelector,
    zoomScaleSelector,
    (block, zoomScale) => {
      let scaledBlock = clone(block);
      if (zoomScale === 1) return scaledBlock;

      const defaultPaths = [
        ["width"],
        ["height"],
        ["top"],
        ["left"],
        ["fontSize"],
        ["borderWidth"]
      ];

      scaledBlock = applyZoomScaleToTarget(
        scaledBlock,
        zoomScale,
        defaultPaths
      );

      return scaledBlock;
    }
  );
};
const selectedObjectsIdsSelector = state =>
  pathOr([], ["project", "selectedObjectsIds"], state);
const getSelectedObjectsLengthSelector = createSelector(
  selectedObjectsIdsSelector,
  selectedIds => {
    return selectedIds.length;
  }
);
const getDisplayedPageBlockActions = createSelector(
  pagesSelector,
  activePageIdSelector,
  blockActionsPagesConfigSelector,
  (pages, activePageId, defaults) => {
    const page = pick(activePageId, pages);
    return merge(pathOr({}, ["blockActions"], page), defaults);
  }
);

const displayedMergedObjectCachedSelector = createCachedSelector(
  (state, bUuid, blocksData) => blocksData,
  objectsDefaultConfigSelector,
  (object, defaults) => {
    return mergeAll([
      defaults.generalCfg,
      defaults[object.subType + "Cfg"],
      object,
      {
        active: false
      }
    ]);
  }
)((state, bUuid, blocksData) => `displayedMerged${bUuid}`);

const scaledDisplayedObjectCachedSelector = createCachedSelector(
  (state, bUuid, block, scale) => block,
  (state, bUuid, block, scale) => scale,
  (block, zoomScale) => {
    let scaledBlock = clone(block);
    if (zoomScale === 1) return scaledBlock;

    const defaultPaths = [
      ["width"],
      ["height"],
      ["top"],
      ["left"],
      ["fontSize"]
    ];

    scaledBlock = applyZoomScaleToTarget(scaledBlock, zoomScale, defaultPaths);

    return scaledBlock;
  }
)((state, bUuid, block, scale) => `scaledDisplayedMerged${bUuid}${scale}`);

const activeScaledDisplayedObjectCachedSelector = createCachedSelector(
  (state, bUuid, block, scale) => block,
  (state, bUuid, block, scale) => scale,
  (block, zoomScale) => {
    let scaledBlock = clone(block);
    if (zoomScale === 1) return scaledBlock;

    const defaultPaths = [
      ["width"],
      ["height"],
      ["top"],
      ["left"],
      ["fontSize"]
    ];

    scaledBlock = applyZoomScaleToTarget(scaledBlock, zoomScale, defaultPaths);

    return scaledBlock;
  }
)((state, bUuid, block, scale) => `scaledDisplayedMerged${bUuid}${scale}`);

registerSelectors({
  totalPages,
  groupsSelector,
  activeGroupSelector,
  displayedPageSelector,
  scaledDisplayedPageSelector,
  displayedObjectSelector,
  scaledDisplayedObjectSelector,
  displayedMergedObjectSelector,
  selectedObjectsIdsSelector,
  getSelectedObjectsLengthSelector,
  displayedPageLabelsSelector
});

module.exports = {
  totalPages,
  groupsSelector,
  activeGroupSelector,
  displayedPageSelector,
  scaledDisplayedPageSelector,
  displayedObjectSelector,
  scaledDisplayedObjectSelector,
  displayedMergedObjectSelector,
  selectedObjectsIdsSelector,
  getSelectedObjectsLengthSelector,
  displayedPageLabelsSelector,
  displayedPagesLabelsSelector,
  getDisplayedPageBlockActions,
  displayedMergedObjectCachedSelector,
  scaledDisplayedObjectCachedSelector
};
