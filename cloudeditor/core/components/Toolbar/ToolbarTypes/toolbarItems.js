const Types = require("../ToolbarConfig/types");

const Bold = {
  type: Types.BUTTON_LETTER_BOLD
};
const Italic = {
  type: Types.BUTTON_LETTER_ITALIC
};

const Underline = {
  type: Types.BUTTON_LETTER_UNDERLINE
};

const LeftAligned = {
  type: Types.BUTTON_LEFT_ALIGNED
};

const RightAligned = {
  type: Types.BUTTON_RIGHT_ALIGNED
};

const CenterAligned = {
  type: Types.BUTTON_CENTER_ALIGNED
};

const JustifyAligned = {
  type: Types.BUTTON_JUSTIFY_ALIGNED,
  position: 0
};

const MenuPoptext = {
  type: Types.POPTEXT_MENU
};

const VAlignPoptext = {
  type: Types.POPTEXT_VALIGN,
  selected: "top_valign"
};

const LayerPoptext = {
  type: Types.POPTEXT_LAYER
};

const FontPoptext = {
  type: Types.POPTEXT_FONT
};

const TextSpaceingSlider = {
  type: Types.SLIDER_TEXT_SPACEING
};

const FontSizeIncremental = {
  type: Types.INCREMENTAL_FONT_SIZE
};

const ColorSelector = {
  type: Types.COLOR_SELECTOR
};

const ImageMenuPoptext = {
  type: Types.POPTEXT_IMAGE_MENU
};
const ImageMenuChangeBackground = {
  type: Types.BUTTON_CHANGE_IMAGE
};
const ImageMenuChangeShape = {
  type: Types.BUTTON_CHANGE_SHAPE,
  settingsPayload: { image: Image, startValue: 180 }
};
const Duplicate = {
  type: Types.BUTTON_DUPLICATE
};

const ColorSelectorBackground = {
  type: Types.COLOR_SELECTOR_BACKGROUND
};

const ImageShapeMenuPoptext = {
  type: Types.POPTEXT_IMAGE_SHAPE_MENU
};
const SliderInlineImage = {
  baseType: Types.SLIDER_INLINE,
  type: Types.SLIDER_INLINE_IMAGE
};
const SimpleIconQuality = {
  type: Types.SIMPLE_ICON_QUALITY
};

module.exports = {
  Bold,
  Italic,
  Underline,
  LeftAligned,
  RightAligned,
  CenterAligned,
  JustifyAligned,
  MenuPoptext,
  VAlignPoptext,
  LayerPoptext,
  FontPoptext,
  TextSpaceingSlider,
  FontSizeIncremental,
  ColorSelector,
  ImageMenuPoptext,
  ImageMenuChangeBackground,
  ImageMenuChangeShape,
  ColorSelectorBackground,
  ImageShapeMenuPoptext,
  SliderInlineImage,
  SimpleIconQuality
};
