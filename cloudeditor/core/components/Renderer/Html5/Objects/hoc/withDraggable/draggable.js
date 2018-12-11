const { is } = require("ramda");
const $ = require("jquery");

require("../../../../../../rewrites/draggable");

const createDraggable = ($el, onDragStart, onDrag, onDragStop) => {
  if ($el.length) {
    $el.draggable({
      snap: ".drag_alignLines",
      snapMode: "customPrintq",
      snapTolerance: 10,
      distance: 2,
      helper: "original",
      start: (event, ui) => {
        if (is(Function, onDragStart)) onDragStart(event, ui);
      },
      drag: (event, ui) => {
        if (is(Function, onDrag)) onDrag(event, ui);
      },
      stop: (event, ui) => {
        if (is(Function, onDragStop)) onDragStop(event, ui);
      },
      snapped: (event, ui) => {
        ui.snapElement.addClass("snaped");
      }
    });
  }
};

const disableDraggable = $el => {
  if (checkUI($el)) $el.draggable("disable");
};
const enableDraggable = ($el, onDragStart, onDrag, onDragStop) => {
  if (checkUI($el)) $el.draggable("enable");
  else createDraggable($el, onDragStart, onDrag, onDragStop);
};

const checkUI = $el => {
  if ($el.length) return $el.data("ui-draggable");
  return false;
};

const handleDraggable = ($el, status, onDragStart, onDrag, onDragStop) => {
  if ($el.length) {
    if (!status) {
      disableDraggable($el);
    } else {
      enableDraggable($el, onDragStart, onDrag, onDragStop);
    }
  }
};

module.exports = handleDraggable;
