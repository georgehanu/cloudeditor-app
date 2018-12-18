const uuidv4 = require("uuid/v4");
const { handleActions } = require("redux-actions");
const { pathOr } = require("ramda");
const {
  REMOVE_ASSET_FROM_GALLERY,
  UPLOAD_ASSET_FAILED,
  UPLOAD_ASSET_START,
  UPLOAD_ASSET_SUCCESS
} = require("../actionTypes/assets");

const initialState = {};
uploadFileStart = (state, action) => {
  return {
    ...state,
    [action.type]: { ...state[action.type], loadingFiles: action.files.length }
  };
};
uploadAssetFailed = (state, action) => {
  return {
    ...state,
    [action.type]: {
      ...state[action.type],
      loading: false,
      errorMessage: action.message,
      loadingFiles: 0
    }
  };
};
uploadAssetSuccces = (state, action) => {
  const newUploadedFiles = pathOr([], [action.type, "uploadedFiles"], state);
  newUploadedFiles.push({ id: uuidv4(), ...action.data });

  return {
    ...state,
    [action.type]: {
      ...state[action.type],
      loading: state[action.type].loadingFiles === 1 ? false : true,
      loadingFiles: 0,
      uploadedFiles: newUploadedFiles
    }
  };
};
const removeAssetFromGallery = (state, action) => {
  let newUploadedFiles = pathOr([], [action.type, "uploadedFiles"], state);
  newUploadedFiles = newUploadedFiles.filter(el => {
    return el.id !== action.id;
  });
  return {
    ...state,
    [action.type]: {
      ...state[action.type],
      uploadedFiles: newUploadedFiles
    }
  };
};
module.exports = handleActions(
  {
    [UPLOAD_ASSET_START]: (state, action) => {
      return uploadFileStart(state, action.payload);
    },
    [UPLOAD_ASSET_FAILED]: (state, action) => {
      return uploadAssetFailed(state, action.payload);
    },
    [UPLOAD_ASSET_SUCCESS]: (state, action) => {
      return uploadAssetSuccces(state, action.payload);
    },
    [REMOVE_ASSET_FROM_GALLERY]: (state, action) => {
      return removeAssetFromGallery(state, action.payload);
    }
  },
  initialState
);
