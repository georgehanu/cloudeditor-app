const React = require("react");
const Renderer = require("../../../../../../core/plugins/FabricRenderer/containers/Fabric");
const isEqual = require("react-fast-compare");

class SliderFabricsRenderer extends React.Component {
  shouldComponentUpdate(nextProps, prevState) {
    if (
      this.props.activeProduct !== nextProps.activeProduct ||
      !isEqual(this.props.propStyle, nextProps.propStyle)
    ) {
      return true;
    }
    return false;
  }

  render() {
    return <Renderer propStyle={this.props.propStyle} />;
  }
}

module.exports = SliderFabricsRenderer;
