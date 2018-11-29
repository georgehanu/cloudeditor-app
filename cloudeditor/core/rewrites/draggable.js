/**
 * "jQuery UI Resizable Snap" - Extension to the jQuery UI Resizable plugin for snapping while resizing.
 *
 * @copyright       Copyright 2011, Alexander Polomoshnov
 * @license         MIT license (https://raw.github.com/polomoshnov/jQuery-UI-Resizable-Snap-extension/master/LICENSE.txt)
 * @link            https://github.com/polomoshnov/jQuery-UI-Resizable-Snap-extension
 * @version         1.9.1
 */

const $ = require("jquery");
require("webpack-jquery-ui/draggable");
(function($) {
  $.extend($.ui.draggable.prototype.options, {
    snapTolerance: 20,
    snapMode: "both"
  });

  $.ui.plugin.add("draggable", "snap", {
    drag: function(event, ui, inst) {
      var ts,
        bs,
        ls,
        rs,
        l,
        r,
        t,
        b,
        i,
        first,
        o = inst.options,
        d = o.snapTolerance,
        x1 = ui.offset.left,
        x2 = x1 + inst.helperProportions.width,
        y1 = ui.offset.top,
        y2 = y1 + inst.helperProportions.height;

      for (i = inst.snapElements.length - 1; i >= 0; i--) {
        if (o.snapMode == "customPrintq") {
          if (inst.snapElements[i].width == 1) inst.snapElements[i].width = 0;
          if (inst.snapElements[i].height == 1) inst.snapElements[i].height = 0;
        }
        l = inst.snapElements[i].left - inst.margins.left;
        r = l + inst.snapElements[i].width;
        t = inst.snapElements[i].top - inst.margins.top;
        b = t + inst.snapElements[i].height;

        if (
          x2 < l - d ||
          x1 > r + d ||
          y2 < t - d ||
          y1 > b + d ||
          !$.contains(
            inst.snapElements[i].item.ownerDocument,
            inst.snapElements[i].item
          )
        ) {
          if (inst.snapElements[i].snapping) {
            inst.options.snap.release &&
              inst.options.snap.release.call(
                inst.element,
                event,
                $.extend(inst._uiHash(), {
                  snapItem: inst.snapElements[i].item
                })
              );
          }
          inst.snapElements[i].snapping = false;
          continue;
        }

        if (o.snapMode !== "inner") {
          ts = Math.abs(t - y2) <= d;
          bs = Math.abs(b - y1) <= d;
          ls = Math.abs(l - x2) <= d;
          rs = Math.abs(r - x1) <= d;
          if (ts) {
            ui.position.top = inst._convertPositionTo("relative", {
              top: t - inst.helperProportions.height,
              left: 0
            }).top;
          }
          if (bs) {
            ui.position.top = inst._convertPositionTo("relative", {
              top: b,
              left: 0
            }).top;
          }
          if (ls) {
            ui.position.left = inst._convertPositionTo("relative", {
              top: 0,
              left: l - inst.helperProportions.width
            }).left;
          }
          if (rs) {
            ui.position.left = inst._convertPositionTo("relative", {
              top: 0,
              left: r
            }).left;
          }
        }

        first = ts || bs || ls || rs;

        if (o.snapMode !== "outer") {
          ts = Math.abs(t - y1) <= d;
          bs = Math.abs(b - y2) <= d;
          ls = Math.abs(l - x1) <= d;
          rs = Math.abs(r - x2) <= d;
          if (ts) {
            ui.position.top = inst._convertPositionTo("relative", {
              top: t,
              left: 0
            }).top;
          }
          if (bs) {
            ui.position.top = inst._convertPositionTo("relative", {
              top: b - inst.helperProportions.height,
              left: 0
            }).top;
          }
          if (ls) {
            ui.position.left = inst._convertPositionTo("relative", {
              top: 0,
              left: l
            }).left;
          }
          if (rs) {
            ui.position.left = inst._convertPositionTo("relative", {
              top: 0,
              left: r - inst.helperProportions.width
            }).left;
          }
        }

        if (!inst.snapElements[i].snapping && (ts || bs || ls || rs || first)) {
          inst.options.snap.snap &&
            inst.options.snap.snap.call(
              inst.element,
              event,
              $.extend(inst._uiHash(), {
                snapItem: inst.snapElements[i].item
              })
            );
        }
        inst.snapElements[i].snapping = ts || bs || ls || rs || first;
      }
    }
  });
})($);
//monkey patch

function monkeyPatch_mouseStart() {
  // don't really need this, but in case I did, I could store it and chain
  var oldFn = $.ui.draggable.prototype._mouseStart;
  $.ui.draggable.prototype._mouseStart = function(event) {
    var o = this.options;

    //Create and append the visible helper
    this.helper = this._createHelper(event);

    //Cache the helper size
    this._cacheHelperProportions();

    //If ddmanager is used for droppables, set the global draggable
    if ($.ui.ddmanager) $.ui.ddmanager.current = this;

    /*
     * - Position generation -
     * This block generates everything position related - it's the core of draggables.
     */

    //Cache the margins of the original element
    this._cacheMargins();

    //Store the helper's css position
    this.cssPosition = this.helper.css("position");
    this.scrollParent = this.helper.scrollParent(true);
    this.offsetParent = this.helper.offsetParent();
    this.hasFixedAncestor =
      this.helper.parents().filter(function() {
        return $(this).css("position") === "fixed";
      }).length > 0;

    //The element's absolute position on the page minus margins
    var angle = $(this.element).data("rotateAngle");
    //The element's absolute position on the page minus margins
    this.offset1 = this.element.offset();
    this.offset = this.positionAbs = {
      top: this.element[0].offsetTop + this.offsetParent.offset().top,
      left: this.element[0].offsetLeft + this.offsetParent.offset().left
    };
    this._refreshOffsets(event);

    //Generate the original position
    this.originalPosition = this.position = this._generatePosition(event);
    this.originalPageX = event.pageX;
    this.originalPageY = event.pageY;

    //Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
    o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt);

    //Set a containment if given in the options
    if (o.containment) this._setContainment();

    //Trigger event + callbacks
    if (this._trigger("start", event) === false) {
      this._clear();
      return false;
    }

    //Recache the helper size
    this._cacheHelperProportions();

    //Prepare the droppable offsets
    if ($.ui.ddmanager && !o.dropBehaviour)
      $.ui.ddmanager.prepareOffsets(this, event);

    this.helper.addClass("ui-draggable-dragging");
    this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

    //If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
    if ($.ui.ddmanager && $.ui.ddmanager.dragStart)
      $.ui.ddmanager.dragStart(this, event);

    return true;
  };
}
monkeyPatch_mouseStart();
