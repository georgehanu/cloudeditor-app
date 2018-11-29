const {
  createSelectorWithDependencies: createSelector
} = require("reselect-tools");
const uuidv4 = require("uuid/v4");
const { merge } = require("ramda");
const { activePageSelector } = require("../project");
const documentBoxesSelector = state =>
  (state && state.project.configs.pages && state.project.configs.pages.boxes) ||
  {};
const getLines = (activePage, coords, helper_type) => {
  let lines = [];
  const height = activePage.height - (coords.top + coords.bottom);
  const width = activePage.width - (coords.left + coords.right);
  lines.push({
    x: coords.left,
    y: coords.top,
    width: 1,
    height: height,
    key: uuidv4(),
    helper_type: helper_type
  });
  lines.push({
    x: coords.left,
    y: coords.top,
    width: width,
    height: 1,
    key: uuidv4(),
    helper_type: helper_type
  });
  lines.push({
    x: activePage.width - coords.right,
    y: coords.top,
    width: 1,
    height: height,
    key: uuidv4(),
    helper_type: helper_type
  });
  lines.push({
    x: coords.left,
    y: activePage.height - coords.bottom,
    width: width,
    height: 1,
    key: uuidv4(),
    helper_type: helper_type
  });
  return lines;
};
const trimboxCoordsSelector = createSelector(
  [activePageSelector, documentBoxesSelector],
  (activePage, boxesDocuments) => {
    const trimboxDocument = boxesDocuments.trimbox;
    const pageTrimbox = (activePage.boxes && activePage.boxes.trimbox) || {};
    const trimboxCoords = merge(trimboxDocument, pageTrimbox);
    return trimboxCoords;
  }
);

const bleedCoordsSelector = createSelector(
  [activePageSelector, documentBoxesSelector],
  (activePage, boxesDocuments) => {
    const bleedDocument = boxesDocuments.bleed;
    const pageBleed = (activePage.boxes && activePage.boxes.bleed) || {};
    const bleedCoords = merge(bleedDocument, pageBleed);
    return bleedCoords;
  }
);
const bleedLinesSelector = createSelector(
  [activePageSelector, bleedCoordsSelector],
  (activePage, coords) => {
    const lines = getLines(activePage, coords, "bleedbox");
    return lines;
  }
);
const trimboxLinesSelector = createSelector(
  [activePageSelector, trimboxCoordsSelector],
  (activePage, coords) => {
    const lines = getLines(activePage, coords, "trimbox");
    return lines;
  }
);
module.exports = {
  trimboxCoordsSelector,
  bleedCoordsSelector,
  bleedLinesSelector,
  trimboxLinesSelector
};
