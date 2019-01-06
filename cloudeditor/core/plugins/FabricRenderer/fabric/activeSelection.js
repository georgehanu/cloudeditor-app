const {
  activeSelectionTypes,
  activeSelectionDefaults
} = require("./types/activeSelection");
const FabricObject = require("./fabricObject");

class activeSelection extends FabricObject {}

activeSelection.propTypes = activeSelectionTypes;

activeSelection.defaultProps = activeSelectionDefaults;

module.exports = activeSelection;
