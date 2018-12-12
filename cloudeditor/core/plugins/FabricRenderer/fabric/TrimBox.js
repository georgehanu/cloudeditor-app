const { fabric } = require("../../../rewrites/fabric/fabric");

const { trimBoxTypes, trimBoxDefaults } = require("./types/trimbox");

const Rect = require("./Rect");

class TrimBox extends Rect {
  constructor(props) {
    super(props);
  }
}

TrimBox.propTypes = trimBoxTypes;
TrimBox.defaultProps = trimBoxDefaults;

module.exports = TrimBox;
