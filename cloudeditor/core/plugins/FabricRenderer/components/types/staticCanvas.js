const {
  shape,
  number,
  string,
  bool,
  array,
  oneOfType,
  instanceOf,
  arrayOf
} = require("prop-types");

const { fabric } = require("../../../../rewrites/fabric/fabric");

const staticCanvasTypes = arrayOf(
  shape({
    allowTouchScrolling: bool,
    backgroundColor: oneOfType([string, instanceOf(fabric.Pattern)]),
    backgroundImage: instanceOf(fabric.Image),
    backgroundVpt: bool,
    controlsAboveOverlay: bool,
    enableRetinaScaling: bool,
    FX_DURATION: number,
    imageSmoothingEnabled: bool,
    includeDefaultValues: bool,
    overlayColor: oneOfType([string, instanceOf(fabric.Pattern)]),
    overlayImage: instanceOf(fabric.Image),
    overlayVpt: bool,
    renderOnAddRemove: bool,
    skipOffscreen: bool,
    stateful: bool,
    svgViewportTransformation: bool,
    viewportTransform: array,
    canvasOffsetX: number,
    canvasOffsetY: number,
    canvasWorkingWidth: number,
    canvasWorkingHeight: number,
    translucentOverlayOutside: string,
    canvasContainer: string,
    snap: number
  })
).isRequired;

const staticCanvasDefaults = {
  allowTouchScrolling: true,
  backgroundColor: "rgb(255,255,255)",
  backgroundImage: null,
  backgroundVpt: true,
  controlsAboveOverlay: false,
  enableRetinaScaling: true,
  FX_DURATION: 500,
  imageSmoothingEnabled: true,
  includeDefaultValues: true,
  overlayColor: "",
  overlayImage: null,
  overlayVpt: true,
  renderOnAddRemove: true,
  skipOffscreen: false,
  stateful: false,
  svgViewportTransformation: true,
  viewportTransform: fabric.iMatrix.concat(),
  vptCoords: [],
  canvasOffsetX: 300,
  canvasOffsetY: 100,
  canvasWorkingWidth: 400,
  canvasWorkingHeight: 500,
  canvasContainer: "",
  translucentOverlayOutside: "rgba(243,244,246,0.6)",
  snap: 10
};

module.exports = { staticCanvasTypes, staticCanvasDefaults };
