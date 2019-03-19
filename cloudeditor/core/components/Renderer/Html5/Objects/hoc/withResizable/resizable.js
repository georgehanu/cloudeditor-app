const { is } = require("ramda");

require("../../../../../../rewrites/resizable");
require("./resizable.css");

const createResizable = ($el, onStart, onResize, onResizeStop, aspectRatio) => {
  if ($el.length) {
    $el.resizable({
      handles: "e,s,se,n,w,nw",
      snap: ".drag_alignLines",
      snapTolerance: 10,
      snapToleranceDynamic: 10,
      aspectRatio,
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
const updateResizable = ($el, aspectRatio) => {
  const uiResizable = $el.data("uiResizable");
  uiResizable.aspectRatio = 1;
};

const disableResizable = $el => {
  if (checkUI($el)) $el.resizable("disable");
};
const enableResizable = (
  $el,
  onResizeStart,
  onResize,
  onResizeStop,
  aspectRatio
) => {
  if (checkUI($el)) {
    const uiResizable = $el.data("uiResizable");
    if (uiResizable._aspectRatio !== aspectRatio) {
      $el.resizable("destroy");
      createResizable($el, onResizeStart, onResize, onResizeStop, aspectRatio);
    }
    if (checkUI($el)) $el.resizable("enable");
  } else
    createResizable($el, onResizeStart, onResize, onResizeStop, aspectRatio);
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
  onResizeStop,
  aspectRatio
) => {
  if ($el.length) {
    if (!status) {
      disableResizable($el);
    } else {
      enableResizable($el, onResizeStart, onResize, onResizeStop, aspectRatio);
    }
  }
};

module.exports = { handleResizable, destroyUi };
