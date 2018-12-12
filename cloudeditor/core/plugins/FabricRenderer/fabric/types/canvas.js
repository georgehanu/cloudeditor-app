const {
  shape,
  number,
  string,
  bool,
  array,
  oneOf,
  arrayOf
} = require("prop-types");
const { merge } = require("ramda");

const { staticCanvasTypes, staticCanvasDefaults } = require("./staticCanvas");

const canvasTypes = arrayOf(
  shape(
    merge(staticCanvasTypes, {
      altActionKey: string,
      altSelectionKey: string,
      centeredKey: string,
      centeredRotation: bool,
      centeredScaling: bool,
      containerClass: string,
      defaultCursor: string,
      fireMiddleClick: bool,
      fireRightClick: bool,
      freeDrawingCursor: string,
      hoverCursor: string,
      interactive: bool,
      isDrawingMode: bool,
      moveCursor: string,
      notAllowedCursor: string,
      perPixelTargetFind: bool,
      preserveObjectStacking: bool,
      rotationCursor: string,
      selection: bool,
      selectionBorderColor: string,
      selectionColor: string,
      selectionDashArray: array,
      selectionFullyContained: bool,
      selectionKey: oneOf([string, array]),
      selectionLineWidth: number,
      skipTargetFind: bool,
      snapAngle: number,
      snapThreshold: number,
      stopContextMenu: bool,
      targetFindTolerance: number,
      uniScaleKey: string,
      uniScaleTransform: bool
    })
  )
).isRequired;

const canvasDefaults = merge(staticCanvasDefaults, {
  altActionKey: "shiftKey",
  altSelectionKey: null,
  centeredKey: "altKey",
  centeredRotation: false,
  centeredScaling: false,
  containerClass: "canvas-container",
  defaultCursor: "default",
  fireMiddleClick: false,
  fireRightClick: false,
  freeDrawingCursor: "crosshair",
  hoverCursor: "move",
  interactive: true,
  isDrawingMode: false,
  moveCursor: "move",
  notAllowedCursor: "not-allowed",
  perPixelTargetFind: false,
  preserveObjectStacking: true,
  rotationCursor: "crosshair",
  selection: true,
  selectionBorderColor: "rgba(255, 255, 255, 0.3)",
  selectionColor: "rgba(100, 100, 255, 0.3)",
  selectionDashArray: [],
  selectionFullyContained: false,
  selectionKey: "shiftKey",
  selectionLineWidth: 1,
  skipTargetFind: false,
  snapAngle: 0,
  snapThreshold: null,
  stopContextMenu: true,
  targetFindTolerance: 0,
  uniScaleKey: "shiftKey",
  uniScaleTransform: false
});

module.exports = { canvasTypes, canvasDefaults };
