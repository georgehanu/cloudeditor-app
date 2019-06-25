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
  DAG_CHANGE_DIMMENSIONS,
  PROJ_LOAD_DAG_SUCCESS
} = require("./../actionTypes/designAndGo");

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
  activeSlider: projectConfigGlobal["activeSlider"] || 0,
  products: projectConfigGlobal["products"],
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
        errorMessage: null
      };
    },
    [DAG_UPLOAD_IMAGE_FAILED]: (state, action) => {
      return {
        ...state,
        loading: false,
        //imagePath: null,
        errorMessage: action.payload
      };
    },
    [DAG_CHANGE_SLIDER]: (state, action) => {
      /* const sliderElements = state.products.length;
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
      } */

      return {
        ...state,
        activeSlider: action.payload
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
      const palleteBgColor = action.payload;
      newProducts[index] = {
        ...state.products[index],
        palleteBgColor
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
    },
    [PROJ_LOAD_DAG_SUCCESS]: (state, action) => {
      const activeSlider = action.data.activeSlider;
      const products = state.products.map((product, index) => {
        if (index === activeSlider)
          return {
            ...product,
            activeColorButton: action.data.activeColorButton,
            palleteBgColor: action.data.palleteBgColor
          };
        return product;
      });
      return {
        ...state,
        products: products
      };
    }
  },
  initialState
);
