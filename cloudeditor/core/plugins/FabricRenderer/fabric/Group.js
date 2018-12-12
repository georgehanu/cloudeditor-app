const { fabric } = require("../../../rewrites/fabric/fabric");
const logger = require("../../../utils/LoggerUtils");
const { groupTypes, groupDefaults } = require("./types/group");
const FabricObject = require("./fabricObject");

class Group extends FabricObject {
  constructor(props) {
    super(props);
    logger.info("new props", props);
    this.instance = new fabric.Group(props._objects, props);
    this._applyProps(props);
  }
}

Group.propTypes = groupTypes;

Group.defaultProps = groupDefaults;

module.exports = Group;
