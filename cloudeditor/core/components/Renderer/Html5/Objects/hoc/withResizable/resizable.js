const { is } = require("ramda");
const $ = require("jquery");

require("../../../../../../rewrites/resizable");
require("./resizable.css");

const createResizable = ($el, onStart, onResize, onResizeStop) => {
  if ($el.length) {
    $el.resizable({
      handles: "n,s,e,w,ne,nw,se,sw",
      snap: ".drag_alignLines",
      start: (event, ui) => {
        if (is(Function, onStart)) onStart(event, ui);
      },
      resize: (event, ui) => {
        if (is(Function, onResize)) onResize(event, ui);
      },
      stop: (event, ui) => {
        $(event.originalEvent.target).one("click", function(e) {
          e.stopImmediatePropagation();
        });
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
  if ($el.length) return $el.data("ui-resizable");
  return false;
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

module.exports = handleResizable;
