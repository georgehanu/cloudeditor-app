const { bleedBoxTypes, bleedBoxDefaults } = require("../types/bleedbox");

const Rect = require("../Rect");

class BleedBox extends Rect {
  constructor(props) {
    super(props);
  }
}

BleedBox.propTypes = bleedBoxTypes;
BleedBox.defaultProps = bleedBoxDefaults;

module.exports = BleedBox;
