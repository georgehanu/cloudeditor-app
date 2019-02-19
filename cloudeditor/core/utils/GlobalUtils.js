let canvas = null;
let loadedFonts = [];

const GlobalUtils = {
  setCanvas: function(fabricCanvas) {
    canvas = fabricCanvas;
  },
  getCanvas: function getCanvas() {
    return canvas;
  },
  pushLoadedFont: function(font) {
    if (loadedFonts.indexOf(font) === -1) {
      loadedFonts.push(font);
    }
  },
  isLoadedFont: function(font) {
    if (loadedFonts.indexOf(font) === -1) {
      return false;
    }
    return true;
  },
  getCanvasImage: function() {
    if (canvas) {
      var image = canvas.toDataURL({
        left: canvas.getCanvasOffsetX(),
        top: canvas.getCanvasOffsetY(),
        width: canvas.getCanvasWorkingWidth(),
        height: canvas.getCanvasWorkingHeight(),
        format: "png"
      });
      canvas.renderAll();
      return image;
    }
  },
  mmToPx: function(value) {
    return parseFloat(value) * 3.779527559;
  }
};

module.exports = GlobalUtils;
