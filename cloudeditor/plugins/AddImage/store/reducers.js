const {
  REMOVE_IMAGE_FROM_GALLERY,
  UPLOAD_IMAGE_FAILED,
  UPLOAD_IMAGE_START,
  UPLOAD_IMAGE_SUCCESS
} = require("./actionTypes");

const initialState = {
  uploadedImages: [],
  storeImages: [],
  loadingImages: 0,
  loading: false,
  errorMessage: null
};
const uuidv4 = require("uuid/v4");
const { handleActions } = require("redux-actions");

module.exports = handleActions(
  {
    [UPLOAD_IMAGE_START]: (state, action) => {
      return {
        ...state,
        loading: true,
        loadingImages: action.payload.length
      };
    },
    [UPLOAD_IMAGE_FAILED]: (state, action) => {
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        loadingImages: 0
      };
    },
    [UPLOAD_IMAGE_SUCCESS]: (state, action) => {
      const newUploadedImages = [...state.uploadedImages];
      newUploadedImages.push({
        id: uuidv4(),
        src: action.payload
      });

      return {
        ...state,
        loading: state.loadingImages === 1 ? false : true,
        errorMessage: null,
        loadingImages: state.loadingImages - 1,
        uploadedImages: newUploadedImages
      };
    },
    [REMOVE_IMAGE_FROM_GALLERY]: (state, action) => {
      const newUploadedImages = state.uploadedImages.filter(el => {
        return el.id !== action.payload.id;
      });
      return {
        ...state,
        uploadedImages: newUploadedImages
      };
    }
  },
  initialState
);
