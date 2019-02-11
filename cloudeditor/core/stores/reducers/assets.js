const uuidv4 = require("uuid/v4");
const { handleActions } = require("redux-actions");
const { pathOr } = require("ramda");
const {
  REMOVE_ASSET_FROM_GALLERY_START,
  REMOVE_ASSET_FROM_GALLERY_SUCCESS,
  REMOVE_ASSET_FROM_GALLERY_FAILED,
  UPLOAD_ASSET_FAILED,
  UPLOAD_ASSET_START,
  UPLOAD_ASSET_SUCCESS,
  ASSETS_LAYOUT_START,
  ASSETS_LAYOUT_SUCCESS,
  ASSETS_LAYOUT_FAILED
} = require("../actionTypes/assets");
const ProjectUtils = require("../../utils/ProjectUtils");
const ConfigUtils = require("../../utils/ConfigUtils");
const config = ConfigUtils.getDefaults();

const LAYOUTS_ASSETS_URL =
  require("../../utils/ConfigUtils").getDefaults().baseUrl +
  "/media/personalization/layouts/projects/";

const initialState = ProjectUtils.getEmptyAssets(config.assets);
uploadFileStart = (state, action) => {
  return {
    ...state,
    [action.type]: {
      ...state[action.type],
      loading: true,
      loadingFiles: action.files.length
    }
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
  const loadingFiles =
    state[action.type].loadingFiles === 0
      ? 0
      : state[action.type].loadingFiles - 1;
  return {
    ...state,
    [action.type]: {
      ...state[action.type],
      loading: state[action.type].loadingFiles === 1 ? false : true,
      loadingFiles: loadingFiles,

      uploadedFiles: newUploadedFiles
    }
  };
};
const removeAssetFromGallery = (state, action) => {
  let newUploadedFiles = pathOr([], [action.type, "uploadedFiles"], state);
  newUploadedFiles = newUploadedFiles.filter(el => {
    return el.id !== action.id;
  });

  if (action.fromToolbar) {
    return {
      ...state,
      [action.type]: {
        ...state[action.type],
        uploadedFiles: newUploadedFiles,
        loadingDeleteToolbar: false
      }
    };
  }

  return {
    ...state,
    [action.type]: {
      ...state[action.type],
      uploadedFiles: newUploadedFiles,
      loadingDelete: false
    }
  };
};

const removeAssetFromGalleryStart = (state, action) => {
  if (action.fromToolbar) {
    return {
      ...state,
      [action.type]: {
        ...state[action.type],
        loadingDeleteToolbar: true
      }
    };
  }
  return {
    ...state,
    [action.type]: {
      ...state[action.type],
      loadingDelete: true
    }
  };
};

const removeAssetFromGalleryFailed = (state, action) => {
  if (action.fromToolbar) {
    return {
      ...state,
      [action.type]: {
        ...state[action.type],
        loadingDeleteToolbar: false
      }
    };
  }
  return {
    ...state,
    [action.type]: {
      ...state[action.type],
      loadingDelete: false
    }
  };
};

const layoutsStart = (state, action) => {
  return {
    ...state,
    layout: {
      ...state.layout,
      loading: true
    }
  };
};

const layoutsSuccess = (state, action) => {
  let newItems = [];
  newItems = action.data.map((el, index) => {
    return { ...el, thumbnail_src: LAYOUTS_ASSETS_URL + el.icon };
  });

  return {
    ...state,
    layout: {
      ...state.layout,
      loading: false,
      items: newItems
    }
  };
};

const layoutsFailed = (state, action) => {
  return {
    ...state,
    layout: {
      ...state.layout,
      loading: false,
      items: []
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
    [REMOVE_ASSET_FROM_GALLERY_START]: (state, action) => {
      return removeAssetFromGalleryStart(state, action.payload);
    },
    [REMOVE_ASSET_FROM_GALLERY_SUCCESS]: (state, action) => {
      return removeAssetFromGallery(state, action.payload);
    },
    [REMOVE_ASSET_FROM_GALLERY_FAILED]: (state, action) => {
      return removeAssetFromGalleryFailed(state, action.payload);
    },
    [ASSETS_LAYOUT_START]: (state, action) => {
      return layoutsStart(state, action.payload);
    },
    [ASSETS_LAYOUT_SUCCESS]: (state, action) => {
      return layoutsSuccess(state, action.payload);
    },
    [ASSETS_LAYOUT_FAILED]: (state, action) => {
      return layoutsFailed(state, action.payload);
    }
  },
  initialState
);
