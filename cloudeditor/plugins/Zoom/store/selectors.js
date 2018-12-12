const zoomValueSelector = state =>
  (state && state.zoom && state.zoom.zoomValue) || 100;

module.exports = {
  zoomValueSelector
};
