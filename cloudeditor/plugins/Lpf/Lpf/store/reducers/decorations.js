const { handleActions } = require("redux-actions");
const ProjectUtils = require("../../../../../core/utils/ProjectUtils");
const ConfigUtils = require("../../../../../core/utils/ConfigUtils");
const config = ConfigUtils.getDefaults();
const { findIndex, clone } = require("ramda");
const {
  CHANGE_DECORATIONS_STEP,
  ENABLE_DISABLE_SHAPE,
  SELECT_SHAPE_SUBTYPE
} = require("../../store/actionTypes/decorations");
const initialState = ProjectUtils.getEmptyDecorations(config.decorations);
const changeDecorationsStep = (state, action) => {
  return { ...state, currentDecoration: action.code };
};
const enableDisableShape = (state, action) => {
  const { code, value } = action;
  let shapeItems = clone([...state.items.shapes.items]);
  const shapeIndex = findIndex(shapeItem => {
    return shapeItem.code === code;
  }, shapeItems);
  shapeItems[shapeIndex].isActive = value;
  return {
    ...state,
    items: {
      ...state.items,
      shapes: {
        ...state.items.shapes,
        items: shapeItems
      }
    }
  };
};
const selectShapeSubtype = (state, action) => {
  const { shape_code, shape_subtype_code } = action;
  let shapeItems = clone([...state.items.shapes.items]);
  const shapeIndex = findIndex(shapeItem => {
    return shapeItem.code === shape_code;
  }, shapeItems);
  let subItems = shapeItems[shapeIndex].subItems;
  subItems.map(subType => {
    if (subType.code === shape_subtype_code) {
      subType.selected = true;
    } else {
      subType.selected = false;
    }
  });
  return {
    ...state,
    items: {
      ...state.items,
      shapes: {
        ...state.items.shapes,
        items: shapeItems
      }
    }
  };
};
module.exports = handleActions(
  {
    [CHANGE_DECORATIONS_STEP]: (state, action) => {
      return changeDecorationsStep(state, action.payload);
    },
    [ENABLE_DISABLE_SHAPE]: (state, action) => {
      return enableDisableShape(state, action.payload);
    },
    [SELECT_SHAPE_SUBTYPE]: (state, action) => {
      return selectShapeSubtype(state, action.payload);
    }
  },
  initialState
);
