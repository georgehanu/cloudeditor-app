const Types = require("../components/DesignAndGoConfig/types");
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
  DAG_CHANGE_RENDER_ID
} = require("./actionTypes");

const { handleActions } = require("redux-actions");

const initialState = {
  loading: false,
  imagePath: null,
  errorMessage: null,
  loadingSignIn: false,
  errorMessageSignIn: null,
  activeSlider: 0,
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
        text: "Create your own jar label",
        class: "DescriptionHeader"
      },
      {
        type: Types.TEXT,
        text:
          "Add the details about your beer and a custom label will be created for you. Use the arrows beside the bottle to try out different designs.",
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
      const sliderElements = state.sliderData.length;
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
      let newSliderData = [...state.sliderData];
      newSliderData[state.activeSlider] = {
        ...state.sliderData[state.activeSlider],
        activeColorButton: action.payload
      };

      return {
        ...state,
        sliderData: newSliderData
      };
    },
    [DAG_CHANGE_COLOR_PICKER]: (state, action) => {
      let newColors = [...state.sliderData[state.activeSlider].colors];
      const pickerIndex = newColors.findIndex(el => {
        return el.colorPicker === true;
      });
      newColors[pickerIndex] = {
        ...newColors[pickerIndex],
        containerBgColor: action.payload.hex
      };
      let newSliderData = [...state.sliderData];
      newSliderData[state.activeSlider] = {
        ...state.sliderData[state.activeSlider],
        colors: newColors
      };

      return {
        ...state,
        sliderData: newSliderData
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
      //debugger;
      return {
        ...state,
        renderId: uuidv4()
      };
    }
  },
  initialState
);
