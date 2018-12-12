const { fabric } = require("../../../rewrites/fabric/fabric");
const StaticCanvas = require("./StaticCanvas");
const { canvasTypes, canvasDefaults } = require("./types/canvas");

class Canvas extends StaticCanvas {
  _initInstance() {
    this.instance = new fabric.Canvas(this.ref);
    this._applyProps(this.props);
  }

  static propTypes = canvasTypes;
  static defaultProps = canvasDefaults;
}

module.exports = Canvas;
