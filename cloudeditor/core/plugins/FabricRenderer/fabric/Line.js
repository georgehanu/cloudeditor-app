const { fabric } = require("../../../rewrites/fabric/fabric");
const { lineTypes, lineDefaults } = require("./types/line");

const FabricObject = require("./fabricObject");

class Line extends FabricObject {
  constructor(props) {
    super(props);
    this.setPropsToSkip({ points: true });
    this.instance = new fabric.Line(this.props.points, this.props);
    this.instance.isLoaded = 1;
    this._applyProps(this.props);
    this._updatePicture();
  }
}

Line.propTypes = lineTypes;
Line.defaultProps = lineDefaults;

module.exports = Line;
