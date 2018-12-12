const { fabric } = require("../../../rewrites/fabric/fabric");
const {
  activeSelectionTypes,
  activeSelectionDefaults
} = require("./types/activeSelection");
const FabricObject = require("./fabricObject");

class activeSelection extends FabricObject {
  constructor(props) {
    super(props);
  }
}

activeSelection.propTypes = activeSelectionTypes;

activeSelection.defaultProps = activeSelectionDefaults;

module.exports = activeSelection;
