const {
  CHANGE_DECORATIONS_STEP,
  ENABLE_DISABLE_SHAPE,
  SELECT_SHAPE_SUBTYPE
} = require("../actionTypes/decorations");
const { createActions } = require("redux-actions");

const {
  changeDecorationsStep,
  enableDisableShape,
  selectShapeSubtype
} = createActions(
  CHANGE_DECORATIONS_STEP,
  ENABLE_DISABLE_SHAPE,
  SELECT_SHAPE_SUBTYPE
);

module.exports = {
  changeDecorationsStep,
  enableDisableShape,
  selectShapeSubtype
};
