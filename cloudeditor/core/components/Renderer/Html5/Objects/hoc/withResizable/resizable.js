const { is } = require("ramda");
const $ = require("jquery");

require("../../../../../../rewrites/resizable");
require("./resizable.css");

const createResizable = ($el, onStart, onResize, onResizeStop) => {
  if ($el.length) {
    $el.resizable({
      handles: "e,s,se,n,w,e,nw",
      snap: ".drag_alignLines",
      snapTolerance: 10,
      snapToleranceDynamic: 10,
      start: (event, ui) => {
        if (is(Function, onStart)) onStart(event, ui);
      },
      resize: (event, ui) => {
        if (is(Function, onResize)) onResize(event, ui);
      },
      stop: (event, ui) => {
        if (is(Function, onResizeStop)) onResizeStop(event, ui);
      },
      snapped: (event, ui) => {
        ui.snapElement.addClass("snaped");
      }
    });
  }
};

const disableResizable = $el => {
  if (checkUI($el)) $el.resizable("disable");
};
const enableResizable = ($el, onResizeStart, onResize, onResizeStop) => {
  if (checkUI($el)) $el.resizable("enable");
  else createResizable($el, onResizeStart, onResize, onResizeStop);
};

const checkUI = $el => {
  if ($el.length) return $el.data("ui-resizable") === undefined ? false : true;
  return false;
};
const destroyUi = $el => {
  if (checkUI($el)) $el.resizable("destroy");
};
const handleResizable = (
  $el,
  status,
  onResizeStart,
  onResize,
  onResizeStop
) => {
  if ($el.length) {
    if (!status) {
      disableResizable($el);
    } else {
      enableResizable($el, onResizeStart, onResize, onResizeStop);
    }
  }
};

module.exports = { handleResizable, destroyUi };
