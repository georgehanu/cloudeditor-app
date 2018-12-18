const $ = require("jquery");
require("webpack-jquery-ui/resizable");
/**
 * "jQuery UI Resizable Snap" - Extension to the jQuery UI Resizable plugin for snapping while resizing.
 *
 * @copyright       Copyright 2011, Alexander Polomoshnov
 * @license         MIT license (https://raw.github.com/polomoshnov/jQuery-UI-Resizable-Snap-extension/master/LICENSE.txt)
 * @link            https://github.com/polomoshnov/jQuery-UI-Resizable-Snap-extension
 * @version         1.9.1
 */
(function($) {
  $.extend($.ui.resizable.prototype.options, {
    snapTolerance: 20,
    snapMode: "both",
    isRotate: 0
  });

  $.ui.plugin.add("resizable", "snap", {
    start: function() {
      var $this = $(this),
        inst = $this.data("ui-resizable"),
        snap = inst.options.snap;
      inst.isRotate = $(this).data("rotateAngle");
      inst.ow = inst.helper.outerWidth() - inst.size.width;
      inst.oh = inst.helper.outerHeight() - inst.size.height;
      inst.lm = getLm($this);
      inst.tm = getTm($this);
      inst.coords = [];
      inst.snapElements = [];
      inst.snapping = false;

      if (inst.isRotate == 0) {
        $(typeof snap == "string" ? snap : ":data(ui-resizable)").each(
          function() {
            if (this == inst.element[0] || this == inst.helper[0]) return;

            var $el = $(this),
              p = $el.position(),
              l = p.left + getLm($el),
              t = p.top + getTm($el),
              $o = $el.offset();

            inst.coords.push({
              item: this,
              snapping: false,
              l: l,
              t: t,
              r: l + $el.outerWidth(),
              b: t + $el.outerHeight(),
              width: $el.outerWidth(),
              height: $el.outerHeight(),
              top: $o.top,
              left: $o.left
            });
          }
        );
      }
    },
    resize: function(event, ui) {
      var inst = $(this).data("ui-resizable");
      inst.isRotate = $(this).data("rotateAngle");
      if (inst.isRotate != 0) return;

      var changeWidth = ui.size.width - ui.originalSize.width; // find change in width
      var newWidth = ui.originalSize.width + changeWidth; // adjust new width by our zoomScale

      var changeHeight = ui.size.height - ui.originalSize.height; // find change in height
      var newHeight = ui.originalSize.height + changeHeight; // adjust new height by our zoomScale

      ui.size.width = newWidth;
      ui.size.height = newHeight;
      var changeLeft = ui.position.left - ui.originalPosition.left; // find change in left
      var newLeft = ui.originalPosition.left + changeLeft; // adjust new left by our zoomScale
      var changeTop = ui.position.top - ui.originalPosition.top; // find change in top
      var newTop = ui.originalPosition.top + changeTop; // adjust new top by our zoomScale
      ui.position.left = newLeft;
      ui.position.top = newTop;

      var ls = [],
        ts = [],
        ws = [],
        hs = [],
        se = [],
        inst = $(this).data("ui-resizable"),
        axes = inst.axis.split(""),
        st = inst.options.snapTolerance,
        md = inst.options.snapMode,
        l = inst.position.left + inst.lm,
        _l = l - st,
        t = inst.position.top + inst.tm,
        _t = t - st,
        r = l + (inst.size.width + inst.ow),
        _r = r + st,
        b = t + (inst.size.height + inst.oh),
        _b = b + st;

      $.each(inst.coords, function() {
        var coords = this,
          w = Math.min(_r, coords.r) - Math.max(_l, coords.l),
          h = Math.min(_b, coords.b) - Math.max(_t, coords.t);

        coords.snapping = false;

        if (w < 0 || h < 0) return;

        if (inst.isRotate != 0) return;
        $.each(axes, function(k, axis) {
          if (md == "outer") {
            switch (axis) {
              case "w":
              case "e":
                if (w > st * 2) return;
                break;
              case "n":
              case "s":
                if (h > st * 2) return;
            }
          } else if (md == "inner") {
            switch (axis) {
              case "w":
              case "e":
                if (w < st * 2) return;
                break;
              case "n":
              case "s":
                if (h < st * 2) return;
            }
          }

          var val = 0;
          switch (axis) {
            case "w":
              val = getC(l - coords.l, l - coords.r, st);
              if (val != null) {
                ls.push(val);
                coords.snapping = true;
              }
              break;
            case "n":
              val = getC(t - coords.t, t - coords.b, st);
              if (val != null) {
                ts.push(val);
                coords.snapping = true;
              }
              break;
            case "e":
              val = getC(r - coords.l, r - coords.r, st);
              if (val != null) {
                ws.push(val);
                coords.snapping = true;
              }
              break;
            case "s":
              val = getC(b - coords.t, b - coords.b, st);
              if (val != null) {
                hs.push(val);
                coords.snapping = true;
              }
          }
        });
      });

      inst.snapping = false;

      if (hs.length) {
        inst.size.height += getN(hs);
        if (inst._aspectRatio || event.shiftKey) {
          inst.size.width = parseInt(inst.size.height * inst.aspectRatio);
        }
        inst.snapping = true;
      }
      if (ws.length) {
        inst.size.width += getN(ws);
        if (inst._aspectRatio || event.shiftKey) {
          inst.size.height = parseInt(inst.size.width / inst.aspectRatio);
        }
        inst.snapping = true;
      }
      if (ls.length) {
        var n = getN(ls);
        inst.position.left += n;
        inst.size.width -= n;
        if (inst._aspectRatio || event.shiftKey) {
          inst.size.height = parseInt(inst.size.width / inst.aspectRatio);
        }
        inst.snapping = true;
      }
      if (ts.length) {
        var n = getN(ts);
        inst.position.top += n;
        inst.size.height -= n;
        if (inst._aspectRatio || event.shiftKey) {
          inst.size.width = parseInt(inst.size.height * inst.aspectRatio);
        }
        inst.snapping = true;
      }
    }
  });

  function getC(lt, rb, st) {
    return Math.abs(lt) < st ? -lt : Math.abs(rb) < st ? -rb : null;
  }

  function getN(ar) {
    return ar.sort(function(a, b) {
      return !a ? 1 : !b ? -1 : Math.abs(a) - Math.abs(b);
    })[0];
  }

  function getLm($el) {
    return parseInt($el.css("margin-left"), 10) || 0;
  }

  function getTm($el) {
    return parseInt($el.css("margin-top"), 10) || 0;
  }

  // These are patches to the jQuery resizable plugin.
  // They are needed in order for the snapping to work properly when the ghost or helper option is used.
  function patch(func, afterFunc, beforeFunc) {
    var fn = $.ui.resizable.prototype[func];
    $.ui.resizable.prototype[func] = function() {
      if (beforeFunc) beforeFunc.apply(this, arguments);
      fn.apply(this, arguments);
      if (afterFunc) afterFunc.apply(this, arguments);
    };
  }

  patch("_mouseStop", null, function() {
    if (this._helper) {
      // 0.1 is a dirty hack to not end up with null if 0 is provided (when snapped to the left or top side of the browser window).
      this.position = {
        left: parseInt(this.helper.css("left"), 10) || 0.1,
        top: parseInt(this.helper.css("top"), 10) || 0.1
      };
      this.size = {
        width: this.helper.outerWidth(),
        height: this.helper.outerHeight()
      };
    }
  });

  patch("_renderProxy", function() {
    if (this._helper) {
      this.helper.css({
        left: this.elementOffset.left,
        top: this.elementOffset.top,
        width: this.element.outerWidth(),
        height: this.element.outerHeight()
      });
    }
  });

  var p = $.ui.resizable.prototype.plugins.resize;
  $.each(p, function(k, v) {
    if (v[0] == "ghost") {
      p.splice(k, 1);
      return false;
    }
  });

  $.each($.ui.resizable.prototype.plugins.start, function(k, v) {
    if (v[0] == "ghost") {
      var fn = v[1];
      v[1] = function() {
        fn.apply(this, arguments);
        $(this)
          .data("ui-resizable")
          .ghost.css({ width: "100%", height: "100%" });
      };
      return false;
    }
  });
})($);
///resizable rotation patch
$(document).ready(function() {
  function n(e) {
    return parseInt(e, 10) || 0;
  }

  //patch: totally based on andyzee work here, thank you
  //patch: https://github.com/andyzee/jquery-resizable-rotation-patch/blob/master/resizable-rotation.patch.js
  //patch: search for "patch:" comments for modifications
  //patch: based on version jquery-ui-1.10.3
  //patch: can be easily reproduced with your current version
  //patch: start of patch
  /**
   * Calculate the size correction for resized rotated element
   * @param {Number} init_w
   * @param {Number} init_h
   * @param {Number} delta_w
   * @param {Number} delta_h
   * @param {Number} _cos in degrees
   * @param {Number} _sin in degrees
   * @returns {object} correction css object {left, top}
   */
  $.getCorrection = function(init_w, init_h, delta_w, delta_h, _cos, _sin) {
    //Get position after rotation with original size
    var x = -init_w / 2;
    var y = init_h / 2;
    var new_x = y * _sin + x * _cos;
    var new_y = y * _cos - x * _sin;
    var diff1 = { left: new_x - x, top: new_y - y };

    var new_width = init_w + delta_w;
    var new_height = init_h + delta_h;

    //Get position after rotation with new size
    var x = -new_width / 2;
    var y = new_height / 2;
    var new_x = y * _sin + x * _cos;
    var new_y = y * _cos - x * _sin;
    var diff2 = { left: new_x - x, top: new_y - y };

    //Get the difference between the two positions
    var offset = { left: diff2.left - diff1.left, top: diff2.top - diff1.top };
    return offset;
  };

  $.ui.resizable.prototype._mouseStart = function(event) {
    var curleft,
      curtop,
      cursor,
      o = this.options,
      el = this.element;

    this.isRotate = $(el).data("rotateAngle");

    this.resizing = true;

    this._renderProxy();

    curleft = n(this.helper.css("left"));
    curtop = n(this.helper.css("top"));

    if (o.containment) {
      curleft += $(o.containment).scrollLeft() || 0;
      curtop += $(o.containment).scrollTop() || 0;
    }

    this.offset = this.helper.offset();
    this.position = { left: curleft, top: curtop };

    this.size = this._helper
      ? {
          width: this.helper.width(),
          height: this.helper.height()
        }
      : {
          width: el.width(),
          height: el.height()
        };

    this.originalSize = this._helper
      ? {
          width: el.outerWidth(),
          height: el.outerHeight()
        }
      : {
          width: el.width(),
          height: el.height()
        };

    this.sizeDiff = {
      width: el.outerWidth() - el.width(),
      height: el.outerHeight() - el.height()
    };

    this.originalPosition = { left: curleft, top: curtop };
    this.originalMousePosition = { left: event.pageX, top: event.pageY };

    //patch: object to store previous data
    this.lastData = this.originalPosition;

    this.aspectRatio =
      typeof o.aspectRatio === "number"
        ? o.aspectRatio
        : this.originalSize.width / this.originalSize.height || 1;

    cursor = $(".ui-resizable-" + this.axis).css("cursor");
    $("body").css("cursor", cursor === "auto" ? this.axis + "-resize" : cursor);

    el.addClass("ui-resizable-resizing");
    this._propagate("start", event);

    //patch: get the angle
    var angle = getAngle(this.element[0]),
      angle_rad = (angle * Math.PI) / 180;
    this._cos = Math.cos(angle_rad);
    this._sin = Math.sin(angle_rad);
    return true;
  };

  $.ui.resizable.prototype._mouseDrag = function(event) {
    var data,
      el = this.helper,
      props = {},
      smp = this.originalMousePosition,
      a = this.axis,
      dx = event.pageX - smp.left || 0,
      dy = event.pageY - smp.top || 0,
      trigger = this._change[a],
      init_w = this.size.width,
      init_h = this.size.height;

    this._updatePrevProperties();

    if (!trigger) {
      return false;
    }

    //patch: cache cosine & sine
    var _cos = this._cos,
      _sin = this._sin,
      //patch: calculate the corect mouse offset for a more natural feel
      ndx = dx * _cos + dy * _sin,
      ndy = dy * _cos - dx * _sin;
    dx = ndx;
    dy = ndy;

    // Calculate the attrs that will be change
    data = trigger.apply(this, [event, dx, dy]);

    // Put this in the mouseDrag handler since the user can start pressing shift while resizing
    this._updateVirtualBoundaries(event.shiftKey);
    if (this._aspectRatio || event.shiftKey) {
      data = this._updateRatio(data, event);
    }

    data = this._respectSize(data, event);

    //patch: backup the position
    var oldPosition = { left: this.position.left, top: this.position.top };

    this._updateCache(data);

    // plugins callbacks need to be called first
    this._propagate("resize", event);

    if (!this.snapping && this.isRotate != 0) {
      //patch: revert to old position
      this.position = { left: oldPosition.left, top: oldPosition.top };

      //patch: difference between datas
      var diffData = {
        left:
          _parseFloat(data.left || this.lastData.left) -
          _parseFloat(this.lastData.left),
        top:
          _parseFloat(data.top || this.lastData.top) -
          _parseFloat(this.lastData.top)
      };

      //patch: calculate the correct position offset based on angle
      var new_data = {};
      new_data.left = diffData.left * _cos - diffData.top * _sin;
      new_data.top = diffData.top * _cos + diffData.left * _sin;

      //patch: round the values
      new_data.left = _round(new_data.left);
      new_data.top = _round(new_data.top);

      //patch: update the position
      this.position.left += new_data.left;
      this.position.top += new_data.top;

      //patch: save the data for later use
      this.lastData = {
        left: _parseFloat(data.left || this.lastData.left),
        top: _parseFloat(data.top || this.lastData.top)
      };

      //patch: calculate the difference in size
      var diff_w = init_w - this.size.width;
      var diff_h = init_h - this.size.height;

      //patch: get the offset based on angle

      var offset = $.getCorrection(init_w, init_h, diff_w, diff_h, _cos, _sin);

      //patch: update the position
      this.position.left += offset.left;
      this.position.top -= offset.top;
    }

    props = this._applyChanges();

    if (!this._helper && this._proportionallyResizeElements.length) {
      this._proportionallyResize();
    }

    // Call the user callback if the element was resized
    if (!$.isEmptyObject(props)) {
      this._updatePrevProperties();
      this._trigger("resize", event, this.ui());
      this._applyChanges();
    }

    return false;
  };

  //patch rotatable and resizable

  //patch: get the angle
  function getAngle(el) {
    var st = window.getComputedStyle(el, null);
    var tr =
      st.getPropertyValue("-webkit-transform") ||
      st.getPropertyValue("-moz-transform") ||
      st.getPropertyValue("-ms-transform") ||
      st.getPropertyValue("-o-transform") ||
      st.getPropertyValue("transform") ||
      null;
    if (tr && tr != "none") {
      var values = tr.split("(")[1];
      values = values.split(")")[0];
      values = values.split(",");

      var a = values[0];
      var b = values[1];

      var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
      while (angle >= 360) angle = 360 - angle;
      while (angle < 0) angle = 360 + angle;
      return angle;
    } else return 0;
  }

  function _parseFloat(e) {
    return isNaN(parseFloat(e)) ? 0 : parseFloat(e);
  }

  function _round(e) {
    return Math.round((e + 0.00001) * 100) / 100;
  }
  /* end of patch functions */
});
