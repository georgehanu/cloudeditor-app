const {
  REMOVE_PDF_FROM_GALLERY,
  UPLOAD_PDF_FAILED,
  UPLOAD_PDF_START,
  UPLOAD_PDF_SUCCESS
} = require("./actionTypes");

const initialState = {
  uploadedPdfs: [],
  loadingPdfs: 0,
  loading: false,
  errorMessage: null
};
const uuidv4 = require("uuid/v4");
const { handleActions } = require("redux-actions");

module.exports = handleActions(
  {
    [UPLOAD_PDF_START]: (state, action) => {
      return {
        ...state,
        loading: true,
        loadingPdfs: action.payload.length
      };
    },
    [UPLOAD_PDF_FAILED]: (state, action) => {
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        loadingPdfs: 0
      };
    },
    [UPLOAD_PDF_SUCCESS]: (state, action) => {
      const newUploadedPdfs = [...state.uploadedPdfs];
      newUploadedPdfs.push({
        id: uuidv4(),
        src: action.payload
      });

      return {
        ...state,
        loading: state.loadingPdfs === 1 ? false : true,
        errorMessage: null,
        loadingPdfs: state.loadingPdfs - 1,
        uploadedPdfs: newUploadedPdfs
      };
    },
    [REMOVE_PDF_FROM_GALLERY]: (state, action) => {
      const newUploadedPdfs = state.uploadedPdfs.filter(el => {
        return el.id !== action.payload.id;
      });
      return {
        ...state,
        uploadedPdfs: newUploadedPdfs
      };
    }
  },
  initialState
);
