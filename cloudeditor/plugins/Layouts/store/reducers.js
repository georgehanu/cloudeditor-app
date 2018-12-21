const { LAYOUTS_SELECT_IMAGE } = require("./actionTypes");

const URL = "http://work.cloudlab.at:9012/ig/uploads/";
const uuidv4 = require("uuid/v4");
const { handleActions } = require("redux-actions");

const initialState = {
  selectedImage: null,
  layoutImages: [
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
};

module.exports = handleActions(
  {
    [LAYOUTS_SELECT_IMAGE]: (state, action) => {
      return {
        ...state,
        selectedImage: action.payload
      };
    }
  },
  initialState
);
