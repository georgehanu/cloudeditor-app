const Types = require("../../components/DesignAndGoConfig/types");
const uuidv4 = require("uuid/v4");
const {
  DAG_UPLOAD_IMAGE,
  DAG_UPLOAD_IMAGE_SUCCESS,
  DAG_UPLOAD_IMAGE_FAILED,
  DAG_CHANGE_SLIDER,
  DAG_CHANGE_ACTIVE_COLOR_SCHEMA,
  DAG_CHANGE_COLOR_PICKER,
  DAG_CHANGE_INPUT,
  DAG_SIGNIN_START,
  DAG_SIGNIN_FAILED,
  DAG_SIGNIN_SUCCESS,
  DAG_SIGNIN_CLEAR_MESSAGE,
  DAG_CHANGE_RENDER_ID,
  DAG_CHANGE_DIMMENSIONS
} = require("./../actionTypes/designAndGo");
//projectConfigGlobal["products"][0]["realDimension"]["width"] = 500;
//projectConfigGlobal["products"][0]["realDimension"]["height"] = 733;
const { merge } = require("ramda");
const { handleActions } = require("redux-actions");
const { dagActiveProductSelector } = require("../selectors");

const initialState = {
  realDimension: projectConfigGlobal["realDimension"],
  loading: false,
  imagePath: null,
  errorMessage: null,
  loadingSignIn: false,
  errorMessageSignIn: null,
  activeSlider: 0,
  products: projectConfigGlobal["products"],
  products1: [
    {
      id: 1,
      label: "Wine 1",
      pageNo: 0,
      mainImage: {
        src:
          "http://work.cloudlab.at:9012/hp/designAndGo/editorImages/Jam2.png",
        width: 1200,
        height: 1400
      },
      cropArea: {
        left: 278,
        top: 450,
        width: 654,
        height: 752
      },
      realDimension: {
        width: 500,
        height: 733
      },
      effects: [
        "http://work.cloudlab.at:9012/hp/designAndGo/editorImages/Jam2_effect.png"
      ],
      hasUpload: true,
      hasCustomPallete: true,
      collorPallets: [{ color: "rgb(255,94,94)" }, { color: "rgb(61,39,255)" }]
    },
    {
      id: 2,
      label: "Wine 2",
      pageNo: 1,
      mainImage: {
        src:
          "http://work.cloudlab.at:9012/hp/designAndGo/editorImages/Jam1.png",
        width: 1200,
        height: 1400
      },
      cropArea: {
        width: 656,
        height: 796,
        top: 410,
        left: 286
      },
      realDimension: {
        width: 40,
        height: 48.53
      },
      effects: [
        "http://work.cloudlab.at:9012/hp/designAndGo/editorImages/Jam1_effect.png"
      ],
      hasUpload: true,
      hasCustomPallete: true,
      collorPallets: [{ color: "rgb(255,94,94)" }, { color: "rgb(61,39,255)" }]
    }
  ],
  sliderData: [
    {
      productImage: "Jam1.png",
      pageNo: 0,
      upload: true,
      colors: [
        {
          containerBgColor: "green",
          color1: "blue",
          color2: "yellow"
        },
        { color1: "blue", color2: "yellow" },
        {},
        { color1: "blue", color2: "yellow" },
        {
          colorPicker: true,
          containerBgColor: "green"
        }
      ],
      activeColorButton: 0,
      labelArea: {
        left: 100 / (1200 / 286),
        top: 100 / (1400 / 410),
        width: 100 / (1200 / 656),
        height: 100 / (1400 / 796)
      }
    },
    {
      productImage: "Jam2.png",
      pageNo: 1,
      colors: [
        {
          containerBgColor: "red",
          color1: "blue",
          color2: "yellow"
        },
        { color1: "blue", color2: "yellow" },
        {},
        {
          colorPicker: true,
          containerBgColor: "yellow"
        }
      ],
      activeColorButton: 1,
      labelArea: {
        left: 100 / (1200 / 278),
        top: 100 / (1400 / 450),
        width: 100 / (1200 / 654),
        height: 100 / (1400 / 752)
      }
    }
  ],
  data: {
    title: {
      type: Types.TITLE,
      class: "Title"
    },
    description: [
      {
        type: Types.TEXT,
        text: projectConfigGlobal["title"],
        class: "DescriptionHeader"
      },
      {
        type: Types.TEXT,
        text: projectConfigGlobal["description"],
        class: "Description"
      }
    ]
  },
  renderId: null
};

module.exports = handleActions(
  //export default handleActions(
  {
    [DAG_UPLOAD_IMAGE]: (state, action) => {
      return {
        ...state,
        loading: true
      };
    },
    [DAG_UPLOAD_IMAGE_SUCCESS]: (state, action) => {
      return {
        ...state,
        loading: false,
        imagePath: action.payload,
        errorMessage: null
      };
    },
    [DAG_UPLOAD_IMAGE_FAILED]: (state, action) => {
      return {
        ...state,
        loading: false,
        imagePath: null,
        errorMessage: action.payload
      };
    },
    [DAG_CHANGE_SLIDER]: (state, action) => {
      const sliderElements = state.products.length;
      let newActiveSlider = state.activeSlider;
      if (action.payload === null) {
        newActiveSlider = 0;
      } else if (action.payload) {
        newActiveSlider = ++newActiveSlider % sliderElements;
      } else {
        newActiveSlider =
          newActiveSlider === 0
            ? sliderElements - 1
            : --newActiveSlider % sliderElements;
      }

      return {
        ...state,
        activeSlider: newActiveSlider
      };
    },
    [DAG_CHANGE_ACTIVE_COLOR_SCHEMA]: (state, action) => {
      const activeProduct = dagActiveProductSelector(state);
      let index = state.products.findIndex(el => {
        return el.id === activeProduct.id && el.pageNo === activeProduct.pageNo;
      });
      if (index === -1) {
        return state;
      }
      const newProducts = [...state.products];
      newProducts[index] = {
        ...state.products[index],
        activeColorButton: action.payload
      };
      return {
        ...state,
        products: newProducts
      };
    },
    [DAG_CHANGE_COLOR_PICKER]: (state, action) => {
      const activeProduct = dagActiveProductSelector(state);
      let index = state.products.findIndex(el => {
        return el.id === activeProduct.id && el.pageNo === activeProduct.pageNo;
      });
      if (index === -1) {
        return state;
      }
      const newProducts = [...state.products];
      newProducts[index] = {
        ...state.products[index],
        palleteBgColor:
          "rgb(" +
          action.payload.rgb.r +
          "," +
          action.payload.rgb.g +
          "," +
          action.payload.rgb.b +
          ")"
      };
      return {
        ...state,
        products: newProducts
      };
    },
    [DAG_CHANGE_INPUT]: (state, action) => {
      let newItems = [...state.data.items];
      let index = state.data.items.findIndex(el => {
        return el.name === action.payload.name;
      });
      if (index === -1) return state;

      newItems[index] = {
        ...newItems[index],
        text: action.payload.value
      };

      return {
        ...state,
        data: {
          ...state.data,
          items: newItems
        }
      };
    },
    [DAG_SIGNIN_START]: (state, action) => {
      return {
        ...state,
        loadingSignIn: true
      };
    },
    [DAG_SIGNIN_SUCCESS]: (state, action) => {
      //console.log(action.email);
      //console.log(action.password);
      return {
        ...state,
        loadingSignIn: false,
        errorMessageSignIn: "LogedIn"
      };
    },
    [DAG_SIGNIN_FAILED]: (state, action) => {
      return {
        ...state,
        loadingSignIn: false,
        errorMessageSignIn: action.payload
      };
    },
    [DAG_SIGNIN_CLEAR_MESSAGE]: (state, action) => {
      return {
        ...state,
        errorMessageSignIn: null
      };
    },
    [DAG_CHANGE_RENDER_ID]: (state, action) => {
      //return state;
      return {
        ...state,
        renderId: uuidv4()
      };
    },
    [DAG_CHANGE_DIMMENSIONS]: (state, action) => {
      //return state;
      return {
        ...state,
        realDimension: merge(state.realDimension, action.payload)
      };
    }
  },
  initialState
);
