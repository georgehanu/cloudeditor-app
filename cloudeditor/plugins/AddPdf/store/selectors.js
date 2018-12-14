const uploadedPdfsSelector = state =>
  (state && state.uiAddPdf && state.uiAddPdf.uploadedPdfs) || [];

const uploadedPdfLoadingPdfSelector = state =>
  (state && state.uiAddPdf && state.uiAddPdf.loadingPdfs) || 0;

const uploadedLoadingSelector = state =>
  (state && state.uiAddPdf && state.uiAddPdf.loading) || false;

module.exports = {
  uploadedPdfsSelector,
  uploadedPdfLoadingPdfSelector,
  uploadedLoadingSelector
};
