const { is } = require("ramda");
const $ = require("jquery");

require("../../../../../../rewrites/draggable");

const createDraggable = ($el, onDragStart, onDrag, onDragStop) => {
  if ($el.length) {
    $el.draggable({
      snap: ".drag_alignLines",
      snapMode: "customPrintq",
      snapTolerance: 10,
      helper: "original",
      start: (event, ui) => {
        console.log("start draggable");
        if (is(Function, onDragStart)) onDragStart(event, ui);
      },
      drag: (event, ui) => {
        console.log("drag draggable");
        if (is(Function, onDrag)) onDrag(event, ui);
      },
      stop: (event, ui) => {
        $(event.originalEvent.target).one("click", function(e) {
          e.stopImmediatePropagation();
        });
        console.log("stop draggable");
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
