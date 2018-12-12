const { fabric } = require("../../../rewrites/fabric/fabric");
const { textTypes, textDefaults } = require("./types/text");

const FabricObject = require("./fabricObject");

class Text extends FabricObject {
  constructor(props) {
    super(props);

    this._initInstance();
  }

  _initInstance() {
    this.instance = new fabric.Text(this.props.text, this.props);
    this._applyProps(this.props);
  }
}

Text.propTypes = textTypes;
Text.defaultProps = textDefaults;

module.exports = Text;
