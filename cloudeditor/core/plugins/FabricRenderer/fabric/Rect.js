const { fabric } = require("../../../rewrites/fabric/fabric");
const { rectTypes, rectDefaults } = require("./types/rect");

const FabricObject = require("./fabricObject");

class Rect extends FabricObject {
  constructor(props) {
    super(props);

    this.instance = new fabric.Rect(this.props);
    this.instance.isLoaded = 1;
    this._applyProps(this.props);
    this._updatePicture();
  }
}

Rect.propTypes = rectTypes;
Rect.defaultProps = rectDefaults;

module.exports = Rect;
