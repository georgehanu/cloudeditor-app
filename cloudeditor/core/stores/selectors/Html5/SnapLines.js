const {
  createSelectorWithDependencies: createSelector
} = require("reselect-tools");
const uuidv4 = require("uuid/v4");
const { forEachObjIndexed, pick, pipe, head, keys, prop } = require("ramda");
const {
  activePageSelector,
  selectedActionsIdsSelector
} = require("./../project");

const snapLinesSelector = createSelector(
  [activePageSelector, selectedActionsIdsSelector],
  (activePage, selectedActionsId) => {
    const objects = { ...activePage.objects };
    let lines = [];
    if (selectedActionsId.length) {
      let selectedObject = pick(selectedActionsId, objects);
      const selectedOjectKey = pipe(
        keys,
        head
      )(selectedObject);
      selectedObject = prop(selectedOjectKey, objects);
      const { rotateAngle } = selectedObject;
      if (rotateAngle != 0) {
        return lines;
      }
      forEachObjIndexed(obj => {
        //left right line
        if (typeof obj.selected === "undefined" && obj.rotateAngle == 0) {
          lines.push({
            x: obj.left,
            y: 0,
            width: 1,
            height: activePage.height,
            key: uuidv4()
          });
          lines.push({
            x: obj.left + obj.width,
            y: 0,
            width: 1,
            height: activePage.height,
            key: uuidv4()
          });
          // top bottom line
          lines.push({
            x: 0,
            y: obj.top,
            width: activePage.width,
            height: 1,
            key: uuidv4()
          });
          lines.push({
            x: 0,
            y: obj.top + obj.height,
            width: activePage.width,
            height: 1,
            key: uuidv4()
          });
        }
      }, objects);
    }
    return lines;
  }
);

module.exports = {
  snapLinesSelector
};
