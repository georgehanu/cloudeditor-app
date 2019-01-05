const { registerSelectors } = require("reselect-tools");
const {
  createDeepEqualSelector: createSelector
} = require("../../rewrites/reselect/createSelector");

const {
  head,
  any,
  flatten,
  forEach,
  merge,
  pathOr,
  pluck,
  pick,
  add,
  values,
  compose,
  last,
  apply,
  lensPath,
  set,
  view,
  concat,
  equals,
  mergeAll,
  forEachObjIndexed,
  clone
} = require("ramda");

const {
  pagesSelector,
  pagesOrderSelector,
  activePageIdSelector,
  facingPagesSelector,
  singleFirstLastPageSelector,
  groupSizeSelector,
  predefinedGroupsSelector,
  pagesDefaultConfigSelector,
  trimboxPagesConfigSelector,
  bleedPagesConfigSelector,
  tolerancePagesConfigSelector,
  includeBoxesSelector,
  useMagneticSelector,
  objectsDefaultConfigSelector,
  blockActionsPagesConfigSelector,
  deletePagePagesConfigSelector,
  showTrimboxSelector
} = require("./project");

const {
  getMaxProp,
  getHeadProp,
  getLastProp,
  addProps
} = require("../../utils/UtilUtils");
const { zoomSelector, scaleSelector } = require("./ui");

const totalPages = createSelector(
  pagesOrderSelector,
  pages => {
    return pages.length;
  }
);

const groupsSelector = createSelector(
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
const activeGroupSelector = createSelector(
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
const displayedPageSelector = groupSelector => {
  return createSelector(
    groupSelector,
    pagesSelector,
    pagesDefaultConfigSelector,
    trimboxPagesConfigSelector,
    bleedPagesConfigSelector,
    tolerancePagesConfigSelector,
    includeBoxesSelector,
    useMagneticSelector,
    activePageIdSelector,
    pagesOrderSelector,
    deletePagePagesConfigSelector,
    showTrimboxSelector,
    (
      group,
      pages,
      config,
      trimbox,
      bleed,
      tolerance,
      includeBoxes,
      useMagnetic,
      activePageId,
      pagesOrder,
      allowDeletePage,
      showTrimbox
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
      let shortLabel = "";
      let selectable = true;
      let background = true;
      let lockPosition = true;
      let pagesLabels = [];
      forEach(page => {
        innerPages[page] = merge(pages[page], config);
        innerPages[page]["boxes"] = {
          trimbox: merge(
            trimbox,
            pathOr({}, [page, "boxes", "trimbox"], pages)
          ),
          bleed: merge(bleed, pathOr({}, [page, "boxes", "bleed"], pages))
        };
        innerPages[page]["boxesMagentic"] = {
          magneticSnapEdge: { left: -1, top: -1, bottom: -1, right: -1 },
          magneticSnap: {
            left: pathOr(tolerance, [page, "snapTolerance"], pages),
            top: pathOr(tolerance, [page, "snapTolerance"], pages),
            bottom: pathOr(tolerance, [page, "snapTolerance"], pages),
            right: pathOr(tolerance, [page, "snapTolerance"], pages)
          }
        };
        innerPages[page]["offset"] = { ...offset };
        innerPages[page]["snapTolerance"] = pathOr(
          tolerance,
          [page, "snapTolerance"],
          pages
        );
        offset["left"] += innerPages[page]["width"];
        pagesLabels[page] = { left: innerPages[page]["width"] };
        label = innerPages[page]["label"];
        shortLabel = innerPages[page]["shortLabel"];
        lockPosition = innerPages[page]["lockPosition"];
        selectable = innerPages[page]["selectable"];
        background = innerPages[page]["background"];
      }, group);

      let boxes = {};
      let magneticBoxes = {};
      const defaultBox = { left: 0, top: 0, bottom: 0, right: 0 };

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
        });
      }, pagesBoxes);
      forEachObjIndexed((pageBoxesMagnetic, pKey) => {
        Object.keys(pageBoxesMagnetic).map(bKey => {
          magneticBoxes[bKey] = defaultBox;
          if (useMagnetic) {
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
          }
        });
      }, pagesBoxesMagnetic);

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
        magneticBoxes: useMagnetic ? magneticBoxes : {},
        lockPosition: lockPosition,
        background: background,
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
        innerPages
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
        if (el != pageIdSelector && !found && pages[el]["countInPagination"]) {
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
        ["magneticBoxes", "magneticSnap", "left"],
        ["borderWidth"]
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
        defaults[object.type + "Cfg"],
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
  getDisplayedPageBlockActions
};
