const {
  CHANGE_ZOOM,
  CHANGE_WORKAREA_PROPS,
  CHANGE_RERENDER_ID,
  UI_ADD_COLOR,
  UI_ADD_LAST_USED_COLOR,
  UI_REMOVE_COLOR
} = require("../actionTypes/ui");
const uuidv4 = require("uuid/v4");

const LAST_USED_COLORS_COUNTER = 5;
const { omit } = require("ramda");

const { handleActions } = require("redux-actions");
const ProjectUtils = require("../../utils/ProjectUtils");
const ConfigUtils = require("../../utils/ConfigUtils");
const config = ConfigUtils.getDefaults();
const initialState = ProjectUtils.getEmptyUI(config.ui);
const changeZoom = (state, payload) => {
  return {
    ...state,
    workArea: {
      ...state.workArea,
      zoom: payload
    }
  };
};
const changeRerenderId = (state, payload) => {
  return {
    ...state,
    rerenderId: payload.id
  };
};
const changeWorkAreaProps = (state, payload) => {
  return {
    ...state,
    workArea: {
      ...state.workArea,
      ...payload
    }
  };
};

const addColor = (state, color, activeTab) => {
  // check if color alreay exists ???
  const newColor = {
    id: uuidv4(),
    htmlRGB: color.htmlRGB,
    RGB: color.RGB,
    CMYK: color.CMYK,
    type: [activeTab],
    new: true
  };
  return {
    ...state,
    colors: {
      ...state.colors,
      [newColor.id]: newColor
    }
  };
};

const addLastUsedColor = (state, payload) => {
  if (state.lastUsedColors.includes(payload)) return state;

  let newUsedColors = [];
  if (state.lastUsedColors.length === LAST_USED_COLORS_COUNTER) {
    newUsedColors = [
      payload,
      ...state.lastUsedColors.slice(0, LAST_USED_COLORS_COUNTER - 1)
    ];
  } else {
    newUsedColors = [payload, ...state.lastUsedColors];
  }

  return {
    ...state,
    lastUsedColors: newUsedColors
  };
};

const removeColor = (state, color, activeTab) => {
  const newColors = omit([color.id], state.colors);
  const newLastUsedColors = state.lastUsedColors.filter(el => {
    return el !== color.id;
  });

  return {
    ...state,
    colors: newColors,
    lastUsedColors: newLastUsedColors
  };
};

module.exports = handleActions(
  {
    [CHANGE_ZOOM]: (state, action) => {
      return changeZoom(state, action.payload);
    },
    [CHANGE_WORKAREA_PROPS]: (state, action) => {
      return changeWorkAreaProps(state, action.payload);
    },
    [CHANGE_RERENDER_ID]: (state, action) => {
      return changeRerenderId(state, action.payload);
    },
    [UI_ADD_COLOR]: (state, action) => {
      return addColor(state, action.payload.color, action.payload.activeTab);
    },
    [UI_ADD_LAST_USED_COLOR]: (state, action) => {
      return addLastUsedColor(state, action.payload);
    },
    [UI_REMOVE_COLOR]: (state, action) => {
      return removeColor(state, action.payload.color, action.payload.activeTab);
    }
  },
  initialState
);
