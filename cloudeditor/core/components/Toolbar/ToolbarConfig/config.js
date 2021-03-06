const Types = require("./types");

const Config = {
  [Types.BUTTON_LETTER_BOLD]: {
    baseType: Types.BUTTON,
    className: "icon printqicon-bold",
    parentClassName: "LetterItem",
    tooltip: { title: "Bold", description: "Dees" }
  },
  [Types.BUTTON_LETTER_ITALIC]: {
    baseType: Types.BUTTON,
    className: "icon printqicon-italic",
    parentClassName: "LetterItem",
    tooltip: "Italic"
  },
  [Types.BUTTON_LETTER_UNDERLINE]: {
    baseType: Types.BUTTON,
    className: "icon printqicon-underline",
    parentClassName: "LetterItem"
  },
  [Types.BUTTON_LEFT_ALIGNED]: {
    baseType: Types.BUTTON,
    className: "icon printqicon-left_align",
    parentClassName: "AlignItem"
  },
  [Types.BUTTON_RIGHT_ALIGNED]: {
    baseType: Types.BUTTON,
    className: "icon printqicon-right_align",
    parentClassName: "AlignItem"
  },
  [Types.BUTTON_CENTER_ALIGNED]: {
    baseType: Types.BUTTON,
    className: "icon printqicon-center_align",
    parentClassName: "AlignItem"
  },
  [Types.BUTTON_JUSTIFY_ALIGNED]: {
    baseType: Types.BUTTON,
    className: "icon printqicon-justify_align",
    parentClassName: "AlignItem"
  },
  [Types.BUTTON_CHANGE_IMAGE]: {
    baseType: Types.BUTTON,
    className: "icon printqicon-background",
    parentClassName: "AlignItem",
    settingsHandler: Types.GALLERY_PREVIEW_WND
  },
  [Types.BUTTON_CHANGE_SHAPE]: {
    baseType: Types.BUTTON,
    className: "icon printqicon-shapes path1 path2",
    parentClassName: "AlignItem",
    settingsHandler: Types.CHANGE_SHAPE_WND
  },
  [Types.BUTTON_DUPLICATE]: {
    baseType: Types.BUTTON,
    className: "icon printqicon-duplicate",
    parentClassName: "LetterItem"
  },
  [Types.POPTEXT_MENU]: {
    baseType: Types.POPTEXT_ICON,
    className: "icon printqicon-more",
    parentClassName: "LetterItem Center",
    poptextClassName: "MenuPoptextList",
    data: [
      { value: "duplicate", label: "", className: "icon printqicon-duplicate" },
      { value: "more", label: "", className: "icon printqicon-more" },
      {
        value: "border_style",
        label: "",
        className: "icon printqicon-border_style",
        settingsHandler: Types.COLOR_SELECTOR_WND,
        settingsPayload: { activeTab: Types.COLOR_TAB_BORDER_WIDTH }
      },
      { value: "user-tie", label: "", className: "icon printqicon-user-tie" }
    ]
  },
  [Types.POPTEXT_VALIGN]: {
    baseType: Types.POPTEXT_ICON,
    className: "icon printqicon-middle_valign",
    parentClassName: "LetterItem",
    poptextClassName: "VAlignPoptextList",
    data: [
      {
        value: "top_valign",
        label: "",
        className: "icon printqicon-top_valign"
      },
      {
        value: "middle_valign",
        label: "",
        className: "icon printqicon-middle_valign"
      },
      {
        value: "bottom_valign",
        label: "",
        className: "icon printqicon-bottom_valign"
      }
    ]
  },
  [Types.POPTEXT_LAYER]: {
    baseType: Types.POPTEXT_ICON,
    className: "icon printqicon-layers",
    parentClassName: "LayerItem",
    poptextClassName: "LayerPoptextList",
    data: [
      {
        value: "bringtofront",
        label: "",
        className: "icon printqicon-bringtofront"
      },
      {
        value: "bringforward",
        label: "",
        className: "icon printqicon-bringforward"
      },
      { value: "layers", label: "", className: "icon printqicon-layers" },
      {
        value: "sendbackward",
        label: "",
        className: "icon printqicon-sendbackward"
      },
      {
        value: "sendtoback",
        label: "",
        className: "icon printqicon-sendtoback"
      }
    ]
  },
  [Types.POPTEXT_FONT]: {
    baseType: Types.POPTEXT_VALUE,
    className: "icon printqicon-layers",
    parentClassName: "FontPoptext",
    poptextClassName: "FontPoptextList",
    dropDown: "icon printqicon-selectdown DropDownArrow",
    data: [
      {
        value: "Arial",
        label: "Arial2",
        className: "Arial"
      },
      { value: "Dax", label: "Dax", className: "Dax" },
      {
        value: "Helvetica",
        label: "Helvetica",
        className: "Helvetica"
      }
    ]
  },
  [Types.SLIDER_TEXT_SPACEING]: {
    baseType: Types.SLIDER,
    className: "icon printqicon-spacing ButtonTextSpaceing",
    parentClassName: "",
    settingsHandler: Types.SLIDER_FONT_WND,
    tooltip: { title: "Change Letter", description: "Change Letter Spacing" }
  },
  [Types.SLIDER_FONT_WND]: {
    baseType: Types.SLIDER_WND,
    type: Types.SLIDER_WND,
    className: "icon printqicon-spacing ButtonTextSpaceing",
    parentClassName: "",
    min: "0",
    max: "1000",
    step: "10"
  },
  [Types.SLIDER_OPACITY_WND]: {
    baseType: Types.SLIDER_WND,
    type: Types.SLIDER_WND,
    className: "icon printqicon-opacity ButtonTextSpaceing",
    parentClassName: "",
    min: "0",
    max: "100",
    step: "1",
    settingsHandler: Types.SLIDER_OPACITY_WND
  },
  [Types.SLIDER_INLINE]: {
    baseType: Types.SLIDER_INLINE,
    className: "",
    parentClassName: ""
  },
  [Types.INCREMENTAL_FONT_SIZE]: {
    baseType: Types.INCREMENTAL,
    className: "icon printqicon-spacing",
    parentClassName: "",
    defaultValue: "28.00",
    fontSize: ""
  },
  [Types.SIMPLE_ICON]: {
    baseType: Types.SIMPLE_ICON,
    threshold: 50,
    range: [
      { value: 100, className: "printqicon-goodsmiley IconSmileyOk" },
      { value: 200, className: "printqicon-normalsmiley IconSmileyNormal" },
      { value: 300, className: "printqicon-badsmiley IconSmileyBad" }
    ]
  },
  [Types.SIMPLE_ICON_QUALITY]: {
    baseType: Types.SIMPLE_ICON,
    threshold: 50,
    range: [
      { value: 100, className: "printqicon-badsmiley IconSmileyBad" },
      { value: 200, className: "printqicon-normalsmiley IconSmileyNormal" },
      { value: 300, className: "printqicon-goodsmiley IconSmileyOk" }
    ]
  },
  [Types.COLOR_SELECTOR]: {
    baseType: Types.COLOR,
    className: "icon printqicon-spacing",
    settingsHandler: Types.COLOR_SELECTOR_WND,
    parentClassName: ""
  },
  [Types.COLOR_SELECTOR_BACKGROUND]: {
    baseType: Types.COLOR,
    className: "icon printqicon-spacing",
    settingsHandler: Types.COLOR_SELECTOR_WND,
    settingsPayload: {
      [Types.COLOR_TAB_FG]: { visible: false },
      [Types.COLOR_TAB_BORDER_COLOR]: { visible: false },
      [Types.COLOR_TAB_BORDER_WIDTH]: { visible: false }
    },
    parentClassName: ""
  },
  [Types.COLOR_SELECTOR_WND]: {
    baseType: Types.COLOR_SELECTOR_WND,
    type: Types.COLOR_SELECTOR_WND,
    parentClassName: "",
    tabs: [
      {
        type: Types.COLOR_TAB_FG,
        baseType: Types.COLOR_TAB_COLOR_CHOOSER,
        position: 1,
        className: "",
        tabName: "ABC",
        visible: true,
        data: [
          "red",
          "yellow",
          "rgb(177,177,177)",
          "#ffeeff",
          "red",
          "yellow",
          "rgb(177,177,177)",
          "#ffeeff"
        ]
      },
      {
        type: Types.COLOR_TAB_BG,
        baseType: Types.COLOR_TAB_COLOR_CHOOSER,
        position: 2,
        className: "icon printqicon-background_block ",
        data: [
          "red",
          "yellow",
          "red",
          "yellow",
          "red",
          "yellow",
          "red",
          "yellow",
          "red",
          "yellow",
          "red",
          "yellow",
          "red",
          "yellow",
          "green",
          "red",
          "yellow",
          "red",
          "yellow",
          "red",
          "yellow",
          "red",
          "yellow",
          "red",
          "yellow",
          "red",
          "yellow",
          "red",
          "yellow"
        ]
      },
      {
        type: Types.COLOR_TAB_BORDER_COLOR,
        baseType: Types.COLOR_TAB_COLOR_CHOOSER,
        position: 3,
        className: "icon printqicon-border-color"
      },
      {
        type: Types.COLOR_TAB_BORDER_WIDTH,
        baseType: Types.COLOR_TAB_WIDTH_CHOOSER,
        position: 4,
        className: "icon printqicon-border-width1"
      }
    ]
  },
  [Types.POPTEXT_IMAGE_MENU]: {
    baseType: Types.POPTEXT_ICON,
    className: "icon printqicon-more",
    parentClassName: "MenuImageContainer",
    poptextClassName: "LayerPoptextList",
    data: [
      {
        value: "effects",
        label: "",
        className: "icon printqicon-effects",
        settingsHandler: Types.SPECIAL_EFFECTS_WND
      },
      { value: "delete", label: "", className: "icon printqicon-delete" },
      { value: "more", label: "", className: "icon printqicon-more" },
      {
        value: "opacity",
        label: "",
        className: "icon printqicon-opacity",
        settingsHandler: Types.SLIDER_OPACITY_WND
      },
      { value: "duplicate", label: "", className: "icon printqicon-duplicate" }
    ]
  },
  [Types.POPTEXT_IMAGE_SHAPE_MENU]: {
    baseType: Types.POPTEXT_ICON,
    className: "icon printqicon-more",
    parentClassName: "MenuImageContainer",
    poptextClassName: "ImageShapePoptextList",
    data: [
      {
        value: "opacity",
        label: "",
        className: "icon printqicon-opacity",
        settingsHandler: Types.SLIDER_OPACITY_WND
      },
      { value: "more", label: "", className: "icon printqicon-more" },
      { value: "duplicate", label: "", className: "icon printqicon-duplicate" }
    ]
  },
  [Types.SPECIAL_EFFECTS_WND]: {
    baseType: Types.SPECIAL_EFFECTS_WND,
    type: Types.SPECIAL_EFFECTS_WND,
    className: "icon printqicon-opacity ButtonTextSpaceing",
    parentClassName: "",
    data: [
      {
        text: "Original",
        className: "original",
        value: "original",
        settingsHandler: Types.FILTER_CHOOSER
      },
      {
        text: "Sepia",
        className: "sepia",
        value: "sepia",
        settingsHandler: Types.FILTER_CHOOSER
      },
      {
        text: "Graustufen",
        className: "greyscale",
        value: "grayscale",
        settingsHandler: Types.FILTER_CHOOSER
      },
      {
        text: "Umkehren",
        className: "invert",
        value: "invert",
        settingsHandler: Types.FILTER_CHOOSER
      },
      {
        text: "Horizontal spiegeln",
        className: "flip_horizontal",
        value: "flip_horizontal",
        settingsHandler: Types.FLIP_CHOOSER
      },
      {
        text: "Vertikal spiegeln",
        className: "flip_vertical",
        value: "flip_vertical",
        settingsHandler: Types.FLIP_CHOOSER
      },
      {
        text: "Beide Richtungen spiegeln",
        className: "flip_both",
        value: "flip_both",
        settingsHandler: Types.FLIP_CHOOSER
      }
    ]
  },
  [Types.CHANGE_SHAPE_WND]: {
    baseType: Types.CHANGE_SHAPE_WND,
    type: Types.CHANGE_SHAPE_WND
  },
  [Types.GALLERY_PREVIEW_WND]: {
    baseType: Types.GALLERY_PREVIEW_WND,
    type: Types.GALLERY_PREVIEW_WND
  },
  [Types.REFRESH_TABLE]: {
    baseType: Types.REFRESH_TABLE,
    className: "icon printqicon-rotate_handler",
    parentClassName: "LetterItem"
  },
  [Types.FUPA_SIMPLE_IMAGE]: {
    baseType: Types.SIMPLE_TEXT,
    className: "fupaImageLogo"
  },
  [Types.FUPA_TEXT]: {
    baseType: Types.SIMPLE_TEXT,
    className: "fupaText",
    text: "Contents of Fupa.net"
  },
  [Types.FUPA_DOWN_ARROW]: {
    baseType: Types.BUTTON,
    className: "icon printqicon-lefttriangle fupaDownArrow",
    parentClassName: "fupaDownArrowContainer"
  },
  [Types.POPTEXT_LINE_HEIGHT]: {
    baseType: Types.POPTEXT_VALUE,
    className: "icon printqicon-layers",
    parentClassName: "LineHeightPoptext",
    poptextClassName: "FontPoptextList",
    dropDown: "icon printqicon-selectdown DropDownArrow",
    data: [
      { value: "0.9", label: "0.9" },
      { value: "1", label: "1" },
      { value: "1.1", label: "1.1" },
      { value: "1.2", label: "1.2" },
      { value: "1.3", label: "1.3" },
      { value: "1.4", label: "1.4" },
      { value: "1.5", label: "1.5" },
      { value: "1.6", label: "1.6" },
      { value: "1.7", label: "1.7" },
      { value: "1.8", label: "1.8" }
    ]
  }
};
module.exports = Config;
