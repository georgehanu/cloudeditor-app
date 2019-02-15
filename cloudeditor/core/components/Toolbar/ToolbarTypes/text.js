const {
  LayerPoptext,
  FontPoptext,
  FontSizeIncremental,
  ColorSelector,
  MenuPoptext,
  Bold,
  Italic,
  Underline,
  LeftAligned,
  RightAligned,
  CenterAligned,
  JustifyAligned,
  VAlignPoptext,
  PoptextLineHeight
} = require("./toolbarItems");
const Types = require("../ToolbarConfig/types");

const text = {
  groups: [
    {
      location: Types.Position.TOP,
      position: 1,
      items: [FontPoptext]
    },
    {
      location: Types.Position.TOP,
      position: 2,
      items: [FontSizeIncremental]
    },
    {
      location: Types.Position.TOP,
      position: 3,
      items: [ColorSelector]
    },
    {
      location: Types.Position.OTHER,
      position: 1,
      items: [MenuPoptext]
    },
    {
      location: Types.Position.BOTTOM,
      position: 1,
      items: [LayerPoptext]
    },
    {
      location: Types.Position.BOTTOM,
      position: 0,
      items: [Bold, Italic, Underline]
    },
    {
      location: Types.Position.BOTTOM,
      position: 3,
      items: [LeftAligned, CenterAligned, RightAligned, JustifyAligned]
    },
    {
      location: Types.Position.BOTTOM,
      position: 4,
      items: [VAlignPoptext, PoptextLineHeight]
    },
    {
      /* used to fill subElements */
      location: Types.Position.HIDDEN,
      items: {
        [Types.COLOR_SELECTOR_WND]: {
          selected: {
            [Types.COLOR_TAB_FG]: 0,
            [Types.COLOR_TAB_BG]: 2,
            [Types.COLOR_TAB_BORDER_COLOR]: null,
            [Types.COLOR_TAB_BORDER_WIDTH]: 80
          }
        }
      }
    }
  ],
  style: {
    backgroundColor: "white"
  }
};

module.exports = text;
