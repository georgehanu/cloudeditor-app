const layoutImagesSelector = state =>
  (state && state.layouts && state.layouts.layoutImages) || [];

const layoutSelectedImageSelector = state =>
  (state && state.layouts && state.layouts.selectedImage) || [];
module.exports = {
  layoutImagesSelector,
  layoutSelectedImageSelector
};
