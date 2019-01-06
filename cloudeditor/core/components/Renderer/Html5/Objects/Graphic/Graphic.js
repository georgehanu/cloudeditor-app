const React = require("react");

require("./Graphic.css");

class GraphicBlock extends React.PureComponent {
  render() {
    const { width, image_src, height } = this.props;
    const style = { width, height, backgroundImage: `url(${image_src})` };
    return <div className="blockData" style={style} />;
  }
}

module.exports = GraphicBlock;
