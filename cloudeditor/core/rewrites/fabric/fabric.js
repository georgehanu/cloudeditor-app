const { fabric } = require("fabric");
const logger = require("../../utils/LoggerUtils");
const uuidv4 = require("uuid/v4");
const { forEach } = require("ramda");
fabric.util.object.extend(fabric.StaticCanvas.prototype, {
  snap: 10,
  canvasScale: 1,
  canvasContainer: "",
  canvasOffsetX: 0,
  canvasOffsetY: 0,
  canvasWorkingWidth: 0,
  canvasWorkingHeight: 0,
  translucentOverlayOutside: "rgba(243,244,246,0.6)",
  setCanvasOffsetX: function(offsetX) {
    this.canvasOffsetX = offsetX;
  },
  setCanvasScale: function(canvasScale) {
    this.canvasScale = canvasScale;
  },
  getCanvasScale: function() {
    return this.canvasScale;
  },
  getCanvasOffsetX: function() {
    return this.canvasOffsetX;
  },
  getCanvasOffsetY: function() {
    return this.canvasOffsetY;
  },
  setCanvasOffsetY: function(offsetY) {
    this.canvasOffsetY = offsetY;
  },
  setCanvasWorkingWidth: function(workingWidth) {
    this.canvasWorkingWidth = workingWidth;
  },
  getCanvasWorkingWidth: function() {
    return this.canvasWorkingWidth;
  },
  getCanvasWorkingHeight: function() {
    return this.canvasWorkingHeight;
  },
  setCanvasWorkingHeight: function(workingHeight) {
    this.canvasWorkingHeight = workingHeight;
  },

  _renderOverlay: function(ctx) {
    this.fire("before:overlay:render", {
      ctx: ctx,
      canvas: this
    });
  }
});
fabric.util.object.extend(fabric.Object.prototype, {
  designerCallbacks: {},
  ignoreSnap: false,
  isLoaded: false,
  lockSkewingX: false,
  lockSkewingY: false
});
fabric.util.object.extend(fabric.Image.prototype, {
  cropX: 0,
  cropY: 0,
  cropW: 0,
  cropH: 0,
  leftSlider: 0,
  fitMethod: "cover", //cover,contain
  brightness: 0,
  contrast: 0,
  ratio: 1,
  resizeTimes: 5,
  isEditing: 0,
  _lastScaleX: 1,
  _lastScaleY: 1,
  _savedProps: {},
  editable: 1,
  canvasX: 0,
  canvasY: 0,
  canvasW: 0,
  canvasH: 0,

  _dimensionAffectingProps: {
    width: 1,
    height: 1,
    scaleX: 1,
    scaleY: 1,
    leftSlider: 1
  },
  initBehavior: function() {
    this.initAddedHandler();
    this.initRemovedHandler();
    this.initCursorSelectionHandlers();
    this.initClickSimulation();
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
  },
  initAddedHandler: function() {
    var _this = this;
    this.on("added", function() {
      var canvas = _this.canvas;
      if (canvas) {
        if (!canvas._hasImageHandlers) {
          canvas._hasImageHandlers = 1;
          _this._initCanvasHandlers(canvas);
        }
        canvas._ImageInstances = canvas._ImageInstances || [];
        canvas._ImageInstances.push(_this);
      }
    });
  },
  initRemovedHandler: function() {
    var _this = this;
    this.on("removed", function() {
      var canvas = _this.canvas;
      if (canvas) {
        canvas._ImageInstances = canvas._ImageInstances || [];
        fabric.util.removeFromArray(canvas._ImageInstances, _this);
        if (canvas._ImageInstances.length === 0) {
          canvas._hasImageHandlers = 0;
          _this._removeCanvasHandlers(canvas);
        }
      }
    });
  },
  initClickSimulation: function() {
    this.on("mousedown", this.onMouseDown.bind(this));
  },
  onMouseDown: function(options) {
    var newPointer = this.canvas.getPointer(options.e);

    this.__lastPointer = newPointer;
    this.__lastSelected = this.selected;
  },
  initCursorSelectionHandlers: function() {
    this.initSelectedHandler(); //done
    this.initMousedownHandler(); //done
    this.initMouseupHandler(); //done
  },
  initMousedownHandler: function() {
    this.on("mousedown", function(options) {
      if (!this.editable) {
        return;
      }
      var pointer = this.canvas.getPointer(options.e);
      if (this.isEditing) {
        this._savedProps["startCx"] = this.cropX;
        this._savedProps["startCy"] = this.cropY;
        this._savedProps["startCanvasX"] = this.canvasX;
        this._savedProps["startCanvasY"] = this.canvasY;
        this._savedProps["startCy"] = this.cropY;
        this._savedProps["startX"] = pointer.x;
        this._savedProps["startY"] = pointer.y;
      }

      this.__mousedownX = pointer.x;
      this.__mousedownY = pointer.y;
      this.__isMousedown = 1;
    });
  },
  initSelectedHandler: function() {
    this.on("selected", function() {
      var _this = this;
      setTimeout(function() {
        _this.selected = 1;
      }, 10);
    });
  },
  initMouseupHandler: function() {
    this.on("mouseup", function(options) {
      this.__isMousedown = 0;
      if (!this.editable || this._isObjectMoved(options.e)) {
        return;
      }
      if (this.__lastSelected && !this.__corner) {
        this.enterEditing(options.e);
      }

      this.selected = 1;
    });
  },
  _isObjectMoved: function(e) {
    var pointer = this.canvas.getPointer(e);

    return this.__mousedownX !== pointer.x || this.__mousedownY !== pointer.y;
  },
  _initCanvasHandlers: function(canvas) {
    canvas._canvasImageSelectionClearedHandlder = function() {
      fabric.Image.prototype.exitEditingOnOthers(canvas);
    }.bind(this);
    canvas._mouseUpImageHandler = function() {
      if (canvas._ImageInstances) {
        canvas._ImageInstances.forEach(function(obj) {
          obj.__isMousedown = 0;
        });
      }
    }.bind(this);
    canvas.on(
      "before:selection:cleared",
      canvas._canvasImageSelectionClearedHandlder
    );
    canvas.on("selection:updated", canvas._canvasImageSelectionClearedHandlder);
    canvas.on("object:selected", canvas._canvasImageSelectionClearedHandlder);
    canvas.on("mouse:up", canvas._mouseUpImageHandler);
  },
  _removeCanvasHandlers: function(canvas) {
    canvas.off(
      "before:selection:cleared",
      canvas._canvasImageSelectionClearedHandlder
    );
    canvas.off(
      "selection:updated",
      canvas._canvasImageSelectionClearedHandlder
    );
    canvas.off("object:selected", canvas._canvasImageSelectionClearedHandlder);
    canvas.off("mouse:up", canvas._mouseUpImageHandler);
  },
  exitEditingOnOthers: function(canvas) {
    if (canvas._ImageInstances) {
      canvas._ImageInstances.forEach(function(obj) {
        obj.selected = 0;
        if (obj.isEditing) {
          obj.exitEditing();
        }
      });
    }
  },
  initMouseMoveHandler: function() {
    this.canvas.on("mouse:move", this.mouseMoveHandler);
  },
  exitEditing: function() {
    this.selected = 0;
    this.isEditing = 0;

    this._restoreEditingProps();

    if (this.canvas) {
      this.canvas.off("mouse:move", this.mouseMoveHandler);
      this.canvas.fire("image:editing:exited", { target: this });
      this.canvas.fire("object:modified", { target: this });
    }

    return this;
  },
  enterEditing: function(e) {
    if (this.isEditing || !this.editable) {
      return;
    }

    if (this.canvas) {
      this.exitEditingOnOthers(this.canvas);
    }

    this.isEditing = 1;

    this._saveEditingProps(e);
    this._setEditingProps();

    if (!this.canvas) {
      return this;
    }
    this.canvas.fire("image:editing:entered", { target: this });
    this.initMouseMoveHandler();
    this.canvas.renderAll();
    return this;
  },
  _setEditingProps: function() {
    this.borderColor = this.editingBorderColor;
    this.borderDashArray = this.editingBorderDashArray;

    this.hasControls = this.selectable = false;
    this.lockMovementX = this.lockMovementY = true;
  },
  _saveEditingProps: function(e) {
    var point = this.canvas.getPointer(e);

    this._savedProps["hasControls"] = this.hasControls;
    this._savedProps["borderColor"] = this.borderColor;
    this._savedProps["lockMovementX"] = this.lockMovementX;
    this._savedProps["lockMovementY"] = this.lockMovementY;
    this._savedProps["selectable"] = this.selectable;
    this._savedProps["startX"] = point.x;
    this._savedProps["startY"] = point.y;
    this._savedProps["startCx"] = this.cropX;
    this._savedProps["startCy"] = this.cropY;
    this._savedProps["startCanvasX"] = this.canvasX;
    this._savedProps["startCanvasY"] = this.canvasY;
    this._savedProps["borderDashArray"] = this.borderDashArray;
  },
  _restoreEditingProps: function() {
    if (!this._savedProps) {
      return;
    }

    this.hasControls = this._savedProps.hasControls;
    this.borderColor = this._savedProps.borderColor;
    this.lockMovementX = this._savedProps.lockMovementX;
    this.lockMovementY = this._savedProps.lockMovementY;
    this.selectable = this._savedProps.selectable;
    this.borderDashArray = this._savedProps.borderDashArray;
  },
  mouseMoveHandler: function(options) {
    if (!this.__isMousedown || !this.isEditing) {
      return;
    }
    var e = options.e,
      xPos,
      yPos,
      imgW = this._originalElement.width,
      imgH = this._originalElement.height;

    if (this.canvas) {
      var point = this.canvas.getPointer(e);
      let widthRatio = 1,
        heightRatio = 1;

      xPos = point.x;
      yPos = point.y;

      if (e) {
        let scaleX = 1,
          scaleY = 1,
          flipX = this.flipX ? -1 : 1,
          flipY = this.flipY ? -1 : 1;
        switch (this.fitMethod) {
          case "contain":
            scaleX = this.getScaledWidth() / this.width;
            scaleY = this.getScaledHeight() / this.height;

            xPos = this.limit(
              this._savedProps.startCanvasX +
                (flipX * (xPos - this._savedProps.startX)) / scaleX,
              -this.width / 2,
              this.width / 2 - this.canvasW
            );
            yPos = this.limit(
              this._savedProps.startCanvasY +
                (flipY * (yPos - this._savedProps.startY)) / scaleY,
              -this.height / 2,
              this.height / 2 - this.canvasH
            );

            this.canvasX = xPos;
            this.canvasY = yPos;
            break;
          case "cover":
            widthRatio = this.cropW / this.getScaledWidth();
            heightRatio = this.cropH / this.getScaledHeight();
            xPos = this.limit(
              this._savedProps.startCx -
                flipX * (xPos - this._savedProps.startX) * widthRatio,
              0,
              imgW - this.cropW
            );
            yPos = this.limit(
              this._savedProps.startCy -
                flipY * (yPos - this._savedProps.startY) * heightRatio,
              0,
              imgH - this.cropH
            );
            this.cropX = xPos;
            this.cropY = yPos;
            break;
          default:
            break;
        }

        this.canvas.renderAll();
      }
    }
  },
  limit: function(value, low, hi) {
    if (value < low) return low;
    if (value > hi) return hi;
    return value;
  },
  _set: function(key, value) {
    var oldScaleX = this.scaleX;
    var oldScaleY = this.scaleY;
    var oldWidth = this.width;
    var oldHeight = this.height;
    var oldLeftSlider = this.leftSlider;

    this.callSuper("_set", key, value);

    if (key in this._dimensionAffectingProps) {
      if (
        oldScaleX != this.scaleX ||
        oldScaleY != this.scaleY ||
        oldWidth != this.width ||
        oldHeight != this.height ||
        oldLeftSlider != this.leftSlider
      ) {
        this._setViewBox({});
        this.setCoords();
      }
    }
  },
  _setViewBox: function(options) {
    if (!this._originalElement) {
      return;
    }

    var originalWidth = this.imageWidth || this._originalElement.width,
      originalHeight = this.imageHeigth || this._originalElement.height,
      scaleX = options.scaleX
        ? Math.abs(parseFloat(options.scaleX))
        : this.scaleX,
      scaleY = options.scaleY
        ? Math.abs(parseFloat(options.scaleY))
        : this.scaleY,
      imgRatio = Math.min(
        (this.width * scaleX) / originalWidth,
        (this.height * scaleY) / originalHeight
      ),
      nw = originalWidth * imgRatio,
      nh = originalHeight * imgRatio,
      cx = options.cx ? parseFloat(options.cx) : 0,
      cy = options.cy ? parseFloat(options.cy) : 0,
      cw = options.cw ? parseFloat(options.cw) : 0,
      ch = options.ch ? parseFloat(options.ch) : 0,
      imageMargins = {
        width: this.width * scaleX,
        height: this.height * scaleY
      };
    let canvasX = 0,
      canvasY = 0,
      canvasH,
      canvasW,
      rBlockRatio = imageMargins.width / imageMargins.height,
      imageRatio = this._element.width / this._element.height;
    if (cw == 0 || ch == 0) {
      switch (this.fitMethod) {
        case "contain":
          if (cw == 0 || ch == 0) {
            if (imageRatio > rBlockRatio) {
              canvasW = this.width;
              canvasH = (this.width / imageRatio / this.scaleY) * this.scaleX;
              canvasX = -this.width / 2 + (this.width - canvasW) * 0.5;
              canvasY = -this.height / 2 + (this.height - canvasH) * 0.5;
            } else {
              canvasW =
                ((this.height * imageRatio) / this.scaleX) * this.scaleY;
              canvasH = this.height;
              canvasX = -this.width / 2 + (this.width - canvasW) * 0.5;
              canvasY = -this.height / 2 + (this.height - canvasH) * 0.5;
            }
            cx = 0;
            cy = 0;
            cw = this._element.width;
            ch = this._element.height;
          }
          break;
        case "cover":
          let ar = 1;
          /// decide which gap to fill
          if (nw < imageMargins.width) {
            ar = imageMargins.width / nw;
          }
          if (Math.abs(ar - 1) < 1e-14 && nh < imageMargins.height) {
            ar = imageMargins.height / nh; // updated see http://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas
          }
          nw *= ar;
          nh *= ar;
          /// calc source rectangle
          cw = originalWidth / (nw / imageMargins.width);
          ch = originalHeight / (nh / imageMargins.height);
          cx = (originalWidth - cw) * 0.5;
          cy = (originalHeight - ch) * 0.5;
          /// make sure source rectangle is valid
          let unitResizeX = (cw - cw / this.resizeTimes) / 2 / 100,
            unitResizeY = (ch - ch / this.resizeTimes) / 2 / 100;

          cx = cx + unitResizeX * this.leftSlider;
          cy = cy + unitResizeY * this.leftSlider;
          cw = cw - 2 * unitResizeX * this.leftSlider;
          ch = ch - 2 * unitResizeY * this.leftSlider;

          if (cx < 0) cx = 0;
          if (cy < 0) cy = 0;
          if (cw > originalWidth) cw = originalWidth;
          if (ch > originalHeight) ch = originalHeight;
          canvasX = -this.width / 2;
          canvasY = -this.height / 2;
          canvasW = this.width;
          canvasH = this.height;
          break;
      }
    }

    this.cropX = cx;
    this.cropY = cy;
    this.cropW = cw;
    this.cropH = ch;
    this.canvasX = canvasX;
    this.canvasY = canvasY;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
  }
});
fabric.Object.prototype.getMainProps = function() {
  return {
    left: this.left,
    top: this.top,
    width: this.width,
    height: this.height,
    angle: this.angle,
    flipX: this.flipX,
    flipY: this.flipY,
    cropX: this.cropX,
    cropY: this.cropY,
    cropW: this.cropW,
    cropH: this.cropH
  };
};
fabric.Image.prototype.initialize = (function(initialize) {
  return function(element, options) {
    initialize.call(this, element, options);
    this.initBehavior();
  };
})(fabric.Image.prototype.initialize);

fabric.Image.prototype.getMainProps = function() {
  return fabric.util.object.extend(this.callSuper("getMainProps"), {
    cropX: this.cropX,
    cropY: this.cropY,
    cropW: this.cropW,
    cropH: this.cropH,
    leftSlider: this.leftSlider,
    brightness: this.brightness,
    contrast: this.contrast
  });
};

fabric.Image.prototype._renderFill = (function(_renderFill) {
  return function(ctx) {
    let elementToDraw = this._element,
      cotrast_brightness = null;

    if (this.brightness != 0) {
      cotrast_brightness = "brightness(" + (100 + this.brightness) + "%) ";
    }
    if (this.contrast != 0) {
      cotrast_brightness += "contrast(" + (100 + this.contrast) + "%)";
    }
    if (cotrast_brightness) {
      ctx.filter = cotrast_brightness;
    }

    elementToDraw &&
      ctx.drawImage(
        elementToDraw,
        this.cropX,
        this.cropY,
        this.cropW,
        this.cropH,
        this.canvasX,
        this.canvasY,
        this.canvasW,
        this.canvasH
      );
  };
})(fabric.Image.prototype._renderFill);
fabric.Image.prototype._initConfig = (function(_initConfig) {
  return function(options) {
    _initConfig.call(this, options);
    this._setViewBox(options);
  };
})(fabric.Image.prototype._initConfig);
fabric.ActiveSelection.prototype.initialize = (function(_initialize) {
  return function(objects, options) {
    _initialize.call(this, objects, options);
    this.id = uuidv4();
  };
})(fabric.ActiveSelection.prototype.initialize);

fabric.Textbox.prototype.getMainProps = function() {
  return fabric.util.object.extend(this.callSuper("getMainProps"), {
    fontSize: this.fontSize,
    text: this.text,
    textAlign: this.textAlign,
    vAlign: this.vAlign
  });
};
fabric.Object.prototype.render = (function(_render) {
  return function(ctx) {
    if (!this.isLoaded) {
      return;
    }
    _render.call(this, ctx);
  };
})(fabric.Object.prototype.render);

fabric.Graphics = fabric.util.createClass(fabric.Group, {
  type: "graphics",
  initialize: function(objects, options, isAlreadyGrouped) {
    this.callSuper("initialize", objects, options, isAlreadyGrouped);
  }
});

fabric.util.object.extend(fabric.util, {
  groupGraphicsSVGElements: function(elements, options, path) {
    var object;

    if (options) {
      if (options.width && options.height) {
        options.centerPoint = {
          x: options.width / 2,
          y: options.height / 2
        };
      } else {
        delete options.width;
        delete options.height;
      }
    }
    object = new fabric.Graphics(elements, options);
    if (typeof path !== "undefined") {
      object.sourcePath = path;
    }
    return object;
  }
});
fabric.Canvas.prototype.addOrRemove = (function(_addOrRemove) {
  return function(functor, eventjsFunctor) {
    _addOrRemove.call(this, functor, eventjsFunctor);
    functor(
      document,
      "update_crop_params",
      (function(that) {
        return function() {
          that.updateCropParams();
        };
      })(this)
    );
  };
})(fabric.Canvas.prototype.addOrRemove);
fabric.Canvas.prototype.updateCropParams = function() {
  if (this._activeObject) {
    switch (this._activeObject.type) {
      case "image":
        if (
          this._activeObject.designerCallbacks &&
          this._activeObject.designerCallbacks.updateCropParams &&
          typeof this._activeObject.designerCallbacks.updateCropParams ===
            "function"
        ) {
          this._activeObject.designerCallbacks.updateCropParams(
            this._activeObject.id,
            {
              cropX: this._activeObject.cropX,
              cropY: this._activeObject.cropY,
              cropW: this._activeObject.cropW,
              cropH: this._activeObject.cropH
            }
          );
        }
        break;
      default:
        break;
    }
  }
};
fabric.Textbox.prototype._initDimensions = function() {
  this.isEditing && this.initDelayedCursor();
  this.clearContextTop();
  this._clearCache();
  // clear dynamicMinWidth as it will be different after we re-wrap line
  this.dynamicMinWidth = 0;
  // wrap lines
  this._styleMap = this._generateStyleMap(this._splitText());
  // if after wrapping, the width is smaller than dynamicMinWidth, change the width and re-wrap
  /*if (this.dynamicMinWidth > this.width) {
    this._set("width", this.dynamicMinWidth);
  }*/
  if (this.textAlign.indexOf("justify") !== -1) {
    // once text is measured we need to make space fatter to make justified text.
    this.enlargeSpaces();
  }
  // clear cache and re-calculate height
  // this.height = this.calcTextHeight();
  this.saveState({ propertySet: "_dimensionAffectingProps" });
};
fabric.Textbox.prototype.initDimensions = function() {
  if (this.__skipDimension) {
    return;
  }

  this._initDimensions();
  // Use defined height as a fixed value. If there's no height value, then use max or calculated height
  if (!this.height) this.height = this.height || this.calcTextHeight();
  // If fontResizing mode enabled
  var textWidth = this.calcTextWidth();
  var textHeight = this.calcTextHeight();
  if (textWidth > this.width) {
    this.fontSize -= 1;
    this.width = this.maxWidth;
    this.initDimensions();
  } else if (textHeight > this.height) {
    this.fontSize -= 1;
    this.initDimensions();
  }
};
fabric.Textbox.prototype.initialize = (function(_initialize) {
  return function(text, options) {
    _initialize.call(this, text, options);
    if (
      this.designerCallbacks &&
      typeof this.designerCallbacks.updateObjectProps === "function"
    ) {
      this.designerCallbacks.updateObjectProps({
        id: this.id,
        props: {
          fontSize: this.fontSize
        }
      });
    }
  };
})(fabric.Textbox.prototype.initialize);
fabric.util.object.extend(fabric.Textbox.prototype, {
  vAlign: "top" //center,bottom
});
fabric.Textbox.prototype._getTopOffset = function() {
  switch (this.vAlign) {
    case "top":
      return -this.height / 2;
    case "center":
      return -this.calcTextHeight() / 2;
    case "bottom":
      return this.height / 2 - this.calcTextHeight();
  }
};
module.exports = { fabric };
