/* eslint-disable react/forbid-foreign-prop-types */
const PropTypes = require("prop-types");
const StaticCanvas = require("../fabric/StaticCanvas");
const Canvas = require("../fabric/Canvas");
const Image = require("../fabric/Image");
const Text = require("../fabric/Text");
const IText = require("../fabric/IText");
const Textbox = require("../fabric/Textbox");
const activeSelection = require("../fabric/activeSelection");
const Group = require("../fabric/Group");
const Graphics = require("../fabric/Graphics");
const Line = require("../fabric/Line");
const Rect = require("../fabric/Rect");
const TrimBox = require("../fabric/TrimBox");
const BleedBox = require("../fabric/BleedBox");

// Creates an element with an element type, props and a root instance

const TYPES = {
  Image: Image,
  Text: Text,
  IText: IText,
  Textbox: Textbox,
  Canvas: Canvas,
  StaticCanvas: StaticCanvas,
  activeSelection: activeSelection,
  Group: Group,
  Line: Line,
  Graphics: Graphics,
  BleedBox: BleedBox,
  TrimBox: TrimBox,
  Rect: Rect
};
function createElement(type, props, ref = null) {
  // Resolve default props
  let forwardedProps = { ...props };
  if (TYPES[type] && TYPES[type].defaultProps) {
    const defaultProps = TYPES[type].defaultProps;
    for (let propName in defaultProps) {
      if (props[propName] === undefined) {
        forwardedProps[propName] = defaultProps[propName];
      }
    }
  }

  const typePropTypes = TYPES[type].propTypes;

  PropTypes.checkPropTypes(typePropTypes, forwardedProps, "prop", type);

  const COMPONENTS = {
    StaticCanvas: () => new StaticCanvas(ref, forwardedProps),
    Canvas: () => new Canvas(ref, forwardedProps),
    Image: () => new Image(forwardedProps),
    Text: () => new Text(forwardedProps),
    IText: () => new IText(forwardedProps),
    Textbox: () => new Textbox(forwardedProps),
    Group: () => new Group(forwardedProps),
    Graphics: () => new Graphics(forwardedProps),
    Line: () => new Line(forwardedProps),
    TrimBox: () => new TrimBox(forwardedProps),
    BleedBox: () => new BleedBox(forwardedProps),
    Rect: () => new Rect(forwardedProps),
    activeSelection: () => new activeSelection(forwardedProps),
    default: undefined
  };

  return COMPONENTS[type]() || COMPONENTS.default;
}

module.exports = { createElement };
