const { pathOr, filter, values, includes, head } = require("ramda");
const { default: createCachedSelector } = require("re-reselect");
const {
  createDeepEqualSelector: createSelector
} = require("../../rewrites/reselect/createSelector");
const Types = require("../../components/Toolbar/ToolbarConfig/types");

const zoomSelector = state => pathOr(1, ["ui", "workArea", "zoom"], state);
const scaleSelector = state => pathOr(1, ["ui", "workArea", "scale"], state);
const canvasSelector = state =>
  pathOr(
    { workingWidth: 0, workingHeight: 0 },
    ["ui", "workArea", "canvas"],
    state
  );
const colorsSelector = state => {
  return values(pathOr({}, ["ui", "colors"], state));
};
const helperBlockSelector = state => {
  return pathOr("", ["ui", "helperBlock"], state);
};
const infoBlockSelector = state => {
  return pathOr("", ["ui", "infoBlock"], state);
};
const permissionsSelector = state => {
  return pathOr({}, ["ui", "permissions"], state);
};
const getTabActiveSelector = (_, props) => {
  return props.activeTab;
};

const selectedObjectsIdsSelector = state => {
  return head(pathOr([], ["project", "selectedObjectsIds"], state));
};

const getObjectsSelector = state => {
  return pathOr([], ["project", "objects"], state);
};

const getActiveBlockColors = createSelector(
  selectedObjectsIdsSelector,
  getObjectsSelector,
  (selectId, objects) => {
    const object = objects[selectId];
    let colors = {};
    colors[Types.COLOR_TAB_FG] = pathOr("", ["fillColor"], object);
    colors[Types.COLOR_TAB_BG] = pathOr("", ["bgColor"], object);
    colors[Types.COLOR_TAB_BORDER_COLOR] = pathOr("", ["borderColor"], object);
    return colors;
  }
);

const colorTabSelector = createCachedSelector(
  [getTabActiveSelector, colorsSelector],
  (activeTab, colors) => {
    return filter(color => {
      return includes(activeTab, color.type);
    }, colors);
  }
)((state, props) => props.activeTab);

const rerenderIdSelector = state => pathOr("null", ["rerenderId"], state);

const lastUsedColorsIdSelector = state => {
  return values(pathOr([], ["ui", "lastUsedColors"], state));
};

const lastUsedColorsSelector = createSelector(
  lastUsedColorsIdSelector,
  colorsSelector,
  (usedIds, colors) => {
    let usedColors = [];
    for (let id in usedIds) {
      const index = colors.findIndex(el => {
        return el.id == usedIds[id];
      });
      usedColors.push(colors[index]);
    }
    return usedColors;
  }
);

const uiFontsSelector = state => {
  return pathOr([], ["ui", "fonts"], state);
};
const fontMetricsSelector = state => {
  return pathOr([], ["ui", "fontMetrics"], state);
};

const uiFontsTinymceSelector = createSelector(
  uiFontsSelector,
  uiFonts => {
    let fonts = "";
    uiFonts.map(el => {
      fonts += el + "=" + el + ";";
    });
    return fonts;
  }
);

module.exports = {
  zoomSelector,
  scaleSelector,
  canvasSelector,
  colorsSelector,
  colorTabSelector,
  getActiveBlockColors,
  rerenderIdSelector,
  lastUsedColorsSelector,
  permissionsSelector,
  uiFontsSelector,
  uiFontsTinymceSelector,
  fontMetricsSelector,
  helperBlockSelector,
  infoBlockSelector
};
