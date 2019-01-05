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
    colors[Types.COLOR_TAB_FG] = pathOr("", ["fillColor", "htmlRGB"], object);
    colors[Types.COLOR_TAB_BG] = pathOr("", ["bgColor", "htmlRGB"], object);
    colors[Types.COLOR_TAB_BORDER_COLOR] = pathOr(
      "",
      ["borderColor", "htmlRGB"],
      object
    );
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
const rerenderIdSelector = state => pathOr("null"["rerenderId"], state);

module.exports = {
  zoomSelector,
  scaleSelector,
  canvasSelector,
  colorsSelector,
  colorTabSelector,
  getActiveBlockColors,
  rerenderIdSelector
};
