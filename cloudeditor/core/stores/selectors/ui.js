const permissionsSelector = state =>
  (state && state.renderer && state.renderer.type) || "html5";

const zoomValueSelector = state =>
  (state && state.ui.workArea && state.ui.workArea.zoom) || 1;

module.exports = {
  permissionsSelector,
  zoomValueSelector
};
