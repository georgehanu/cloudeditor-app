const {
  REMOVE_IMAGE_FROM_GALLERY,
  UPLOAD_IMAGE_START,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAILED
} = require("./actionTypes");

const { createActions } = require("redux-actions");

const {
  removeImageFromGallery,
  uploadImageStart,
  uploadImageSuccess,
  uploadImageFailed
} = createActions(
  REMOVE_IMAGE_FROM_GALLERY,
  UPLOAD_IMAGE_START,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAILED
);

module.exports = {
  removeImageFromGallery,
  uploadImageStart,
  uploadImageSuccess,
  uploadImageFailed
};
