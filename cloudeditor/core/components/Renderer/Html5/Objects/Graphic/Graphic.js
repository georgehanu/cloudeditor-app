const React = require("react");
const randomColor = require("randomcolor");
const PropTypes = require("prop-types");
const ContentEditable = require("../ContentEditable/ContentEditable");

require("./Graphic.css");

class GraphicBlock extends React.PureComponent {
  render() {
    const { width, image_src, height, ...otherProps } = this.props;
    const style = { width, height, backgroundImage: `url(${image_src})` };
    return <div className="blockData" style={style} />;
  }
}

module.exports = GraphicBlock;
