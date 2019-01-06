const { trimBoxTypes, trimBoxDefaults } = require("./types/trimbox");

const Rect = require("./Rect");

class TrimBox extends Rect {}

TrimBox.propTypes = trimBoxTypes;
TrimBox.defaultProps = trimBoxDefaults;

module.exports = TrimBox;
