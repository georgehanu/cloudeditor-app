const React = require("react");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const { DropTarget } = require("react-dnd");
const ConfigUtils = require("../../../../../../core/utils/ConfigUtils");
const baseUrl =
  ConfigUtils.getConfigProp("baseUrl") + "/media/personalization/";
require("./Graphic.css");
const type = ["graphics"];
const GraphicTarget = {
  drop(props, monitor, component) {
    if (monitor.isOver()) {
      const { id, ...otherProps } = monitor.getItem();
      props.onUpdateProps({
        id: props.id,
        props: {
          ...otherProps
        }
      });
    }
  },
  canDrop(props, monitor) {
    if (!props.viewOnly) {
      return true;
    }
    return false;
  },
  hover(props, monitor) {}
};

collectDrop = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    clientOffset: monitor.getClientOffset()
  };
};
class GraphicBlock extends React.PureComponent {
  render() {
    const { width, image_src, height } = this.props;

    const imageUrl = baseUrl + image_src;
    const style = { width, height, backgroundImage: `url(${imageUrl})` };
    return this.props.connectDropTarget(
      <div className="blockData" style={style} />
    );
  }
}
module.exports = hot(module)(
  connect(
    null,
    null
  )(DropTarget(type, GraphicTarget, collectDrop)(GraphicBlock))
);
