const { createActions } = require("redux-actions");
const {
  REMOVE_ASSET_FROM_GALLERY,
  UPLOAD_ASSET_START,
  UPLOAD_ASSET_SUCCESS,
  UPLOAD_ASSET_FAILED,
  ASSETS_LAYOUT_START,
  ASSETS_LAYOUT_SUCCESS,
  ASSETS_LAYOUT_FAILED
} = require("../actionTypes/assets");

const {
  removeAssetFromGallery,
  uploadAssetStart,
  uploadAssetSuccess,
  uploadAssetFailed,
  assetsLayoutStart,
  assetsLayoutSuccess,
  assetsLayoutFailed
} = createActions(
  REMOVE_ASSET_FROM_GALLERY,
  UPLOAD_ASSET_START,
  UPLOAD_ASSET_SUCCESS,
  UPLOAD_ASSET_FAILED,
  ASSETS_LAYOUT_START,
  ASSETS_LAYOUT_SUCCESS,
  ASSETS_LAYOUT_FAILED
);

module.exports = {
  removeAssetFromGallery,
  uploadAssetStart,
  uploadAssetSuccess,
  uploadAssetFailed,
  assetsLayoutStart,
  assetsLayoutSuccess,
  assetsLayoutFailed
};
