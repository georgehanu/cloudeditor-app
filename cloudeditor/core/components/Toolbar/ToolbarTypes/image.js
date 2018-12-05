const {
  LayerPoptext,
  ImageMenuChangeBackground,
  ImageMenuChangeShape,
  ImageMenuPoptext,
  SliderInlineImage,
  SimpleIconQuality
} = require("./toolbarItems");
const Types = require("../ToolbarConfig/types");

const image = {
  groups: [
    {
      location: Types.Position.TOP,
      position: 1,
      items: [LayerPoptext]
    },
    {
      location: Types.Position.TOP,
      position: 2,
      className: "GroupWithBorder",
      items: [SliderInlineImage]
    },
    {
      location: Types.Position.TOP,
      position: 3,
      items: [
        SimpleIconQuality,
        ImageMenuChangeBackground,
        ImageMenuChangeShape,
        ImageMenuPoptext
      ]
    },
    {
      /* used to fill subElements */
      location: Types.Position.HIDDEN,
      items: {
        [Types.SPECIAL_EFFECTS_WND]: {
          image: Image,
          brightnessValue: -20,
          contrastValue: 80,
          brightnessClass: "flip_horizontal",
          brightnessFilter: "grayscale(1)"
        },
        [Types.SLIDER_OPACITY_WND]: {
          defaultValue: 75
        }
      }
    }
  ],
  style: {
    backgroundColor: "green",
    marginTop: "0px"
  }
};

module.exports = image;
