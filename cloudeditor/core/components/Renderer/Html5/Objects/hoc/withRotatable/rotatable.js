const { is } = require("ramda");
const $ = require("jquery");

require("../../../../../../rewrites/rotatable");
require("./rotatable.css");

const createRotatable = ($el, onStart, onRotate, onRotateStop, radians) => {
  if ($el.length) {
    $el.rotatable({
      angle: radians,
      start: (event, ui) => {
        if (is(Function, onStart)) onStart(event, ui);
      },
      rotate: (event, ui) => {
        if (is(Function, onRotate)) onRotate(event, ui);
      },
      stop: (event, ui) => {
        $(event.originalEvent.target).one("click", function(e) {
          e.stopImmediatePropagation();
        });
        if (is(Function, onRotateStop)) onRotateStop(event, ui);
      }
    });
  }
};

const disableRotatable = $el => {
  if (checkUI($el)) $el.rotatable("disable");
};
const enableRotatable = (
  $el,
  onRotatableStart,
  onRotate,
  onRotateStop,
  radians
) => {
  if (checkUI($el)) $el.rotatable("enable");
  else createRotatable($el, onRotatableStart, onRotate, onRotateStop, radians);
};

const checkUI = $el => {
  if ($el.length) return $el.data("ui-rotatable");
  return false;
};

const handleRotatable = (
  $el,
  status,
  onRotateStart,
  onRotate,
  onRotateStop,
  radians
) => {
  if ($el.length) {
    $el.data("rotateAngle", radians);
    if (!status) {
      disableRotatable($el);
    } else {
      enableRotatable($el, onRotateStart, onRotate, onRotateStop, radians);
    }
  }
};

module.exports = handleRotatable;
