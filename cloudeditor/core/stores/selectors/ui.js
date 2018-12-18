const { pathOr } = require("ramda");

const zoomSelector = state => pathOr(1, ["ui", "workArea", "zoom"], state);
const scaleSelector = state => pathOr(1, ["ui", "workArea", "scale"], state);
module.exports = {
  zoomSelector,
  scaleSelector
};
