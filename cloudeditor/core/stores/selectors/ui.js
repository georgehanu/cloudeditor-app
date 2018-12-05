const { pathOr } = require("ramda");

const zoomSelector = state => pathOr(1, ["ui", "workArea", "zoom"], state);
const scaleSelector = state => pathOr(1, ["ui", "workArea", "scale"], state);
const canvasSelector = state =>
  pathOr(
    { workingWidth: 0, workingHeight: 0 },
    ["ui", "workArea", "canvas"],
    state
  );
module.exports = {
  zoomSelector,
  scaleSelector,
  canvasSelector
};
