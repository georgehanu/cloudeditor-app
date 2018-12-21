const uploadedImagesSelector = state =>
  (state && state.uiAddImage && state.uiAddImage.uploadedImages) || [];

const uploadedImagesLoadingImagesSelector = state =>
  (state && state.uiAddImage && state.uiAddImage.loadingImages) || 0;

const uploadedLoadingSelector = state =>
  (state && state.uiAddImage && state.uiAddImage.loading) || false;

module.exports = {
  uploadedImagesSelector,
  uploadedImagesLoadingImagesSelector,
  uploadedLoadingSelector
};
