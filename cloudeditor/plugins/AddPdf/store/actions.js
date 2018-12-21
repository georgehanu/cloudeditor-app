const {
  REMOVE_PDF_FROM_GALLERY,
  UPLOAD_PDF_START,
  UPLOAD_PDF_SUCCESS,
  UPLOAD_PDF_FAILED
} = require("./actionTypes");

const { createActions } = require("redux-actions");

const {
  removePdfFromGallery,
  uploadPdfStart,
  uploadPdfSuccess,
  uploadPdfFailed
} = createActions(
  REMOVE_PDF_FROM_GALLERY,
  UPLOAD_PDF_START,
  UPLOAD_PDF_SUCCESS,
  UPLOAD_PDF_FAILED
);

module.exports = {
  removePdfFromGallery,
  uploadPdfStart,
  uploadPdfSuccess,
  uploadPdfFailed
};
