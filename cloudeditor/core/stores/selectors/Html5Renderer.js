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
  reduce,
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
  includeBoxesSelector,
  objectsDefaultConfigSelector
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
    includeBoxesSelector,
    (group, pages, config, trimbox, bleed, includeBoxes) => {
      const innerPages = {};
      //initial offset of pages
      var x = { y: 1, x: 3 };

      const offset = { left: 0, top: 0 };
      console.log("selectot html5", group);
      forEach(page => {
        innerPages[page] = merge(pages[page], config);
        innerPages[page]["boxes"] = {
          trimbox: merge(
            pathOr({}, [page, "boxes", "trimbox"], pages),
            trimbox
          ),
          bleed: merge(pathOr({}, [page, "boxes", "bleed"], pages), bleed)
        };
        innerPages[page]["offset"] = { ...offset };
        offset["left"] += innerPages[page]["width"];
      }, group);

      const trimBoxes = compose(
        pluck("trimbox"),
        pluck("boxes")
      )(innerPages);

      const bleedBoxes = compose(
        pluck("bleed"),
        pluck("boxes")
      )(innerPages);
      let boxes = {};
      const defaultBox = {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0
      };

      var pagesBoxes = pluck("boxes", innerPages);
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
        boxes: boxes,
        offset: {
          left: includeBoxes ? getMaxProp(boxes, "left") : 0,
          top: includeBoxes ? getMaxProp(boxes, "top") : 0
        },
        innerPages
      };
    }
  );
};

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
      console.log("selectot scale", zoomScale);
      let scaledPage = clone(page);
      if (zoomScale === 1) return scaledPage;

      const defaultPaths = [
        ["width"],
        ["height"],
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
  getSelectedObjectsLengthSelector
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
  getSelectedObjectsLengthSelector
};
