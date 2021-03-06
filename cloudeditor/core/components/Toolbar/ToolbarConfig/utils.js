const Types = require("../ToolbarConfig/types");
const Operation = require("../ToolbarConfig/operation");
const { mergeAll, clone } = require("ramda");

const MergeClassName = (defaultClass, newClass) => {
  if (newClass === null || newClass === undefined) {
    return defaultClass;
  }
  if (defaultClass === null) {
    return newClass;
  }

  if (typeof newClass === "string") {
    if (typeof defaultClass === "string") {
      return [defaultClass, newClass].join(" ");
    } else {
      return [...defaultClass, newClass].join(" ");
    }
  } else {
    if (typeof defaultClass === "string") {
      return [defaultClass, ...newClass].join(" ");
    } else {
      return [...defaultClass, ...newClass].join(" ");
    }
  }
};

const comparePosition = (a, b) => {
  if (a.position > b.position) {
    return 1;
  }
  if (a.position < b.position) {
    return -1;
  }
  return 0;
};

const filterBasedOnLocation = (items, position) => {
  return items
    .filter(el => {
      return el.location === position;
    })
    .sort((a, b) => comparePosition(a, b));
};
const imageQuality = (activeItem, options) => {
  let cropWidth = activeItem.cropW * activeItem.ratio,
    cropHeight = activeItem.cropH * activeItem.ratio,
    width_i =
      activeItem.width *
      (options.pageDimmensions.pageWidth /
        0.75 /
        options.uiPageOffset.canvas.workingWidth) *
      0.01041667,
    height_i =
      activeItem.height *
      (options.pageDimmensions.pageHeight /
        0.75 /
        options.uiPageOffset.canvas.workingHeight) *
      0.01041667,
    result =
      Math.sqrt(Math.pow(cropWidth, 2) + Math.pow(cropHeight, 2)) /
      Math.sqrt(Math.pow(width_i, 2) + Math.pow(height_i, 2));
  return 300;
};

const LoadImageSettings = (
  toolbar,
  activeItem,
  activeLayer,
  options,
  background = false
) => {
  for (let groupIndex in toolbar.groups) {
    let group = toolbar.groups[groupIndex];
    for (let itemIndex in group.items) {
      let item = group.items[itemIndex];

      if (item.type === Types.POPTEXT_LAYER) {
        item.operation = Operation.MERGE_DATA;
        item.newData = [];
        if (activeLayer.front !== undefined && activeLayer.front === false) {
          item.newData = [
            { value: "bringtofront", disabled: true },
            { value: "bringforward", disabled: true }
          ];
        }
        if (activeLayer.back !== undefined && activeLayer.back === false) {
          item.newData = [
            ...item.newData,
            { value: "sendbackward", disabled: true },
            { value: "sendtoback", disabled: true }
          ];
        }
      } else if (item.type === Types.SLIDER_INLINE_IMAGE) {
        item.defaultValue = parseInt(activeItem.leftSlider);
      } else if (item.type === Types.SIMPLE_ICON_QUALITY) {
        item.threshold = imageQuality(activeItem, options);
      } else if (background) {
        if (item.type === Types.COLOR_SELECTOR_BACKGROUND) {
          //item.color = activeItem.fill;
          item.color = activeItem.bgColor
            ? "rgb(" + activeItem.bgColor.htmlRGB + ")"
            : activeItem.fill;
        }
      }
    }
  }
  return toolbar;
};

const LoadImageAdditionalInfo = (activeItem, background = false) => {
  let info = {
    [Types.CHANGE_SHAPE_WND]: { image: activeItem.image_src, startValue: 180 },
    [Types.SPECIAL_EFFECTS_WND]: {
      image: activeItem.image_src,
      brightnessValue: activeItem.brightness,
      contrastValue: activeItem.contrast,
      filter: activeItem.filter,
      flip: activeItem.flip
    },
    [Types.SLIDER_OPACITY_WND]: { defaultValue: 100 * activeItem.opacity }
  };

  if (background) {
    info[Types.COLOR_SELECTOR_WND] = {
      selected: {
        [Types.COLOR_TAB_BG]: 0
      }
    };
  }
  return info;
};

const LoadTextSettings = (toolbar, activeItem, activeLayer, fonts) => {
  for (let groupIndex in toolbar.groups) {
    let group = toolbar.groups[groupIndex];
    for (let itemIndex in group.items) {
      let item = group.items[itemIndex];

      if (item.type === Types.POPTEXT_VALIGN) {
        item.selected = activeItem.vAlign + "_valign";
      } else if (item.type === Types.BUTTON_LEFT_ALIGNED) {
        item.selected = activeItem.textAlign === "left";
      } else if (item.type === Types.BUTTON_RIGHT_ALIGNED) {
        item.selected = activeItem.textAlign === "right";
      } else if (item.type === Types.BUTTON_CENTER_ALIGNED) {
        item.selected = activeItem.textAlign === "center";
      } else if (item.type === Types.BUTTON_JUSTIFY_ALIGNED) {
        item.selected = activeItem.textAlign === "justify";
      } else if (item.type === Types.BUTTON_LETTER_BOLD) {
        item.selected = activeItem.bold;
      } else if (item.type === Types.BUTTON_LETTER_ITALIC) {
        item.selected = activeItem.italic;
      } else if (item.type === Types.BUTTON_LETTER_UNDERLINE) {
        item.selected = activeItem.underline;
      } else if (item.type === Types.COLOR_SELECTOR) {
        //item.color = activeItem.fill;
        item.color = activeItem.fillColor
          ? "rgb(" + activeItem.fillColor.htmlRGB + ")"
          : activeItem.fill;
      } else if (item.type === Types.SLIDER_TEXT_SPACEING) {
        item.defaultValue = parseInt(activeItem.charSpacing);
      } else if (item.type === Types.INCREMENTAL_FONT_SIZE) {
        item.fontSize = activeItem.fontSize;
      } else if (item.type === Types.POPTEXT_FONT) {
        item.value = activeItem.fontFamily;
        item.operation = Operation.NEW_DATA;
        item.newData = fonts.map((el, index) => {
          return {
            value: el,
            label: el,
            className: "",
            fontFamily: el
          };
        });
      } else if (item.type === Types.POPTEXT_LINE_HEIGHT) {
        if (isNaN(parseFloat(activeItem.lineheightp))) item.value = 1.2;
        else {
          if (activeItem.lineheightp >= 50)
            item.value = activeItem.lineheightp / 100;
          else item.value = activeItem.lineheightp;
        }
      } else if (item.type === Types.POPTEXT_LAYER) {
        item.operation = Operation.MERGE_DATA;
        item.newData = [];
        if (activeLayer.front !== undefined && activeLayer.front === false) {
          item.newData = [
            { value: "bringtofront", disabled: true },
            { value: "bringforward", disabled: true }
          ];
        }
        if (activeLayer.back !== undefined && activeLayer.back === false) {
          item.newData = [
            ...item.newData,
            { value: "sendbackward", disabled: true },
            { value: "sendtoback", disabled: true }
          ];
        }
      } else if (item.type === Types.REFRESH_TABLE) {
        item.refreshLoading = activeItem.refreshLoading;
        if (activeItem.fupaData) {
          item.visible = true;
          item.lastRefreshTime = activeItem.fupaData.queryData.queryTime;
        } else {
          item.visible = false;
        }
      }
    }
  }
  return toolbar;
};

const LoadTinymceTableSettings = (toolbar, activeItem, activeLayer, fonts) => {
  for (let groupIndex in toolbar.groups) {
    let group = toolbar.groups[groupIndex];
    for (let itemIndex in group.items) {
      let item = group.items[itemIndex];

      if (item.type === Types.POPTEXT_VALIGN) {
        item.selected = activeItem.vAlign + "_valign";
      } else if (item.type === Types.BUTTON_LEFT_ALIGNED) {
        item.selected = activeItem.textAlign === "left";
      } else if (item.type === Types.BUTTON_RIGHT_ALIGNED) {
        item.selected = activeItem.textAlign === "right";
      } else if (item.type === Types.BUTTON_CENTER_ALIGNED) {
        item.selected = activeItem.textAlign === "center";
      } else if (item.type === Types.BUTTON_JUSTIFY_ALIGNED) {
        item.selected = activeItem.textAlign === "justify";
      } else if (item.type === Types.BUTTON_LETTER_BOLD) {
        item.selected = activeItem.bold;
      } else if (item.type === Types.BUTTON_LETTER_ITALIC) {
        item.selected = activeItem.italic;
      } else if (item.type === Types.BUTTON_LETTER_UNDERLINE) {
        item.selected = activeItem.underline;
      } else if (item.type === Types.COLOR_SELECTOR) {
        //item.color = activeItem.fill;
        item.color = activeItem.fillColor
          ? "rgb(" + activeItem.fillColor.htmlRGB + ")"
          : activeItem.fill;
      } else if (item.type === Types.SLIDER_TEXT_SPACEING) {
        item.defaultValue = parseInt(activeItem.charSpacing);
      } else if (item.type === Types.INCREMENTAL_FONT_SIZE) {
        item.fontSize = activeItem.fontSize;
      } else if (item.type === Types.POPTEXT_FONT) {
        item.value = activeItem.fontFamily;
        item.operation = Operation.NEW_DATA;
        item.newData = fonts.map((el, index) => {
          return {
            value: el,
            label: el,
            className: "",
            fontFamily: el
          };
        });
      } else if (item.type === Types.POPTEXT_LINE_HEIGHT) {
        item.value = activeItem.lineHeight || 1.2;
      } else if (item.type === Types.POPTEXT_LAYER) {
        item.operation = Operation.MERGE_DATA;
        item.newData = [];
        if (activeLayer.front !== undefined && activeLayer.front === false) {
          item.newData = [
            { value: "bringtofront", disabled: true },
            { value: "bringforward", disabled: true }
          ];
        }
        if (activeLayer.back !== undefined && activeLayer.back === false) {
          item.newData = [
            ...item.newData,
            { value: "sendbackward", disabled: true },
            { value: "sendtoback", disabled: true }
          ];
        }
      }
    }
  }
  return toolbar;
};

const LoadTextAdditionalInfo = activeItem => {
  return {
    [Types.COLOR_SELECTOR_WND]: {
      selected: {
        [Types.COLOR_TAB_FG]: 0,
        [Types.COLOR_TAB_BG]: 2,
        [Types.COLOR_TAB_BORDER_COLOR]: null,
        [Types.COLOR_TAB_BORDER_WIDTH]: activeItem.borderWidth || 0
      }
    }
  };
};

const CreatePayload = (activeitem, itemPayload) => {
  let attrs = {};
  switch (itemPayload.type) {
    case Types.POPTEXT_VALIGN:
      attrs = { vAlign: itemPayload.value.replace("_valign", "") };
      break;
    case Types.BUTTON_CENTER_ALIGNED:
      attrs = { textAlign: "center" };
      break;
    case Types.BUTTON_LEFT_ALIGNED:
      attrs = { textAlign: "left" };
      break;
    case Types.BUTTON_RIGHT_ALIGNED:
      attrs = { textAlign: "right" };
      break;
    case Types.BUTTON_JUSTIFY_ALIGNED:
      attrs = { textAlign: "justify" };
      break;
    case Types.FLIP_CHOOSER:
      attrs = { flip: itemPayload.value };
      break;
    case Types.FILTER_CHOOSER:
      attrs = { filter: itemPayload.value };
      if (itemPayload.value === "original") {
        attrs = { filter: "", flip: "" };
      }
      break;
    case Types.BUTTON_LETTER_BOLD:
      attrs = { bold: !activeitem.bold };
      break;

    case Types.BUTTON_LETTER_ITALIC:
      attrs = { italic: !activeitem.italic };
      break;

    case Types.BUTTON_LETTER_UNDERLINE:
      attrs = { underline: !activeitem.underline };
      break;

    case Types.COLOR_TAB_FG:
      attrs = {
        fillColor: {
          colorSpace: activeitem.fillColor.colorSpace,
          ...itemPayload.value
        }
      };
      break;

    case Types.COLOR_TAB_BG:
      attrs = {
        bgColor: {
          colorSpace: activeitem.bgColor.colorSpace,
          ...itemPayload.value
        }
      };

      if (activeitem.backgroundblock) {
        const removeImage = {
          image_path: null,
          image_src: null,
          image: null,
          imageWidth: 0,
          imageHeight: 0,
          cropW: 0,
          cropH: 0,
          subType: "image"
        };
        attrs = mergeAll([clone(attrs), removeImage]);
      }
      break;

    case Types.COLOR_TAB_BORDER_COLOR:
      attrs = {
        borderColor: {
          colorSpace: activeitem.bgColor.colorSpace,
          ...itemPayload.value
        }
      };
      break;

    case Types.SLIDER_FONT_WND:
      attrs = { charSpacing: itemPayload.value };
      break;
    case Types.COLOR_TAB_BORDER_WIDTH:
      attrs = { borderWidth: itemPayload.value };
      break;

    case Types.INCREMENTAL_FONT_SIZE:
      attrs = { fontSize: parseFloat(itemPayload.value) };
      break;

    case "Brightness":
      attrs = { brightness: parseFloat(itemPayload.value) };
      break;

    case "Contrast":
      attrs = { contrast: parseFloat(itemPayload.value) };
      break;

    case Types.POPTEXT_FONT:
      attrs = { fontFamily: itemPayload.value };
      break;

    case Types.POPTEXT_LINE_HEIGHT:
      attrs = {
        lineheightp: itemPayload.value
      };
      break;

    case Types.POPTEXT_LAYER:
      attrs = { action: itemPayload.value };
      return { id: activeitem.id, props: attrs, action: "layer" };

    case Types.POPTEXT_MENU:
      if (itemPayload.value === "duplicate") {
        return { id: activeitem.id, props: attrs, action: "duplicate" };
      } else {
        return null;
      }

    case Types.POPTEXT_IMAGE_MENU:
      if (itemPayload.value === "duplicate") {
        return { id: activeitem.id, props: attrs, action: "duplicate" };
      } else if (itemPayload.value === "delete") {
        return { id: activeitem.id, props: attrs, action: "delete" };
      } else {
        return null;
      }
    case Types.SLIDER_INLINE_IMAGE:
      attrs = {
        leftSlider: itemPayload.value.value,
        activeAction: itemPayload.value.activeAction
      };
      break;

    case Types.GALLERY_PREVIEW_WND:
      attrs = { image: itemPayload.value };
      break;

    case Types.REFRESH_TABLE:
      if (activeitem.fupaData === undefined || activeitem.fupaData === null)
        return null;
      return {
        id: activeitem.id,
        fupaData: activeitem.fupaData,
        action: "refreshTable"
      };

    case Types.BUTTON_DUPLICATE:
      return { id: activeitem.id, props: attrs, action: "duplicate" };

    case Types.SLIDER_OPACITY_WND:
      attrs = { opacity: itemPayload.value / 100 };
      break;

    default:
      break;
  }
  return { id: activeitem.id, props: attrs };
};

const calculateToolBarPosition = (targetPosition, toolbarType) => {
  // scale = scale + ((zoom * 100 - 100) / 100) * scale;
  let leftPosition = targetPosition.left + targetPosition.width / 2;
  let topPosition = targetPosition.top - 15;

  if (leftPosition + toolbarType.width / 2 > window.innerWidth) {
    leftPosition = window.innerWidth - toolbarType.width / 2;
  } else if (leftPosition - toolbarType.width / 2 < 0) {
    leftPosition = toolbarType.width / 2;
  }

  if (targetPosition.top - 15 < toolbarType.height) {
    topPosition = toolbarType.height;
  }

  return {
    top: topPosition,
    left: leftPosition,
    width: toolbarType.width
  };
};
module.exports = {
  MergeClassName,
  comparePosition,
  filterBasedOnLocation,
  imageQuality,
  LoadImageSettings,
  LoadImageAdditionalInfo,
  LoadTextSettings,
  LoadTinymceTableSettings,
  LoadTextAdditionalInfo,
  CreatePayload,
  calculateToolBarPosition
};
