const uuidv4 = require("uuid/v4");
const { handleActions } = require("redux-actions");
const { pathOr } = require("ramda");
const {
  REMOVE_ASSET_FROM_GALLERY,
  UPLOAD_ASSET_FAILED,
  UPLOAD_ASSET_START,
  UPLOAD_ASSET_SUCCESS
} = require("../actionTypes/assets");

const URL = "http://work.cloudlab.at:9012/ig/uploads/";

const initialState = {
  layout: {
    items: [
      {
        id: uuidv4(),
        src:
          URL +
          "2018-07-23%2010_42_50-React%2016%20-%20The%20Complete%20Guide%20(incl.%20React%20Router%204%20&%20Redux)%20_%20Udemy.png",
        thumbnail_src:
          URL +
          "2018-07-23%2010_42_50-React%2016%20-%20The%20Complete%20Guide%20(incl.%20React%20Router%204%20&%20Redux)%20_%20Udemy.png"
      },
      {
        id: uuidv4(),
        src:
          URL +
          "2018-07-23%2010_42_50-React%2016%20-%20The%20Complete%20Guide%20(incl.%20React%20Router%204%20&%20Redux)%20_%20Udemy.png",
        thumbnail_src:
          URL +
          "2018-07-23%2010_42_50-React%2016%20-%20The%20Complete%20Guide%20(incl.%20React%20Router%204%20&%20Redux)%20_%20Udemy.png"
      },
      {
        id: uuidv4(),
        src:
          URL +
          "2018-07-23%2010_42_50-React%2016%20-%20The%20Complete%20Guide%20(incl.%20React%20Router%204%20&%20Redux)%20_%20Udemy.png",
        thumbnail_src:
          URL +
          "2018-07-23%2010_42_50-React%2016%20-%20The%20Complete%20Guide%20(incl.%20React%20Router%204%20&%20Redux)%20_%20Udemy.png"
      },
      {
        id: uuidv4(),
        src:
          URL +
          "2018-07-23%2010_42_50-React%2016%20-%20The%20Complete%20Guide%20(incl.%20React%20Router%204%20&%20Redux)%20_%20Udemy.png",
        thumbnail_src:
          URL +
          "2018-07-23%2010_42_50-React%2016%20-%20The%20Complete%20Guide%20(incl.%20React%20Router%204%20&%20Redux)%20_%20Udemy.png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(2).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(3).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(4).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(5).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(6).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(7).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(8).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },

      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(9).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(10).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(2).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(3).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(4).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(5).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(6).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(7).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(8).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },

      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(9).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(10).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(2).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(3).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(4).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(5).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(6).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(7).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(8).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },

      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(9).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(10).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(2).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(3).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(4).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(5).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(6).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(7).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(8).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },

      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(9).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(10).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(2).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(3).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(4).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(5).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(6).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(7).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(8).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },

      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(9).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(10).png",
        thumbnail_src: URL + "1%20-%20Copy%20(2).png"
      }
    ]
  }
  /*layout: {
    items: [
      {
        id: uuidv4(),
        src:
          URL +
          "2018-07-23%2010_42_50-React%2016%20-%20The%20Complete%20Guide%20(incl.%20React%20Router%204%20&%20Redux)%20_%20Udemy.png"
      },
      {
        id: uuidv4(),
        src:
          URL +
          "2018-07-23%2010_42_50-React%2016%20-%20The%20Complete%20Guide%20(incl.%20React%20Router%204%20&%20Redux)%20_%20Udemy.png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(2).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(3).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(4).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(5).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(6).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(7).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(8).png"
      },

      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(9).png"
      },
      {
        id: uuidv4(),
        src: URL + "1%20-%20Copy%20(10).png"
      }
    ]
  }*/
};
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
