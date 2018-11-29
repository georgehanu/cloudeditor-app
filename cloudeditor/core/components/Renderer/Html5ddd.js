const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");
const randomColor = require("randomcolor");

class Html5Renderer extends React.Component {
  render() {
    const style = {
      backgroundColor: randomColor()
    };
    return (
      <div
        style={style}
        className="canvas-container"
        ref={this.canvasContainerRef}
      />
    );
  }
}
Html5Renderer.propTypes = {};

Html5Renderer.defaultProps = {};

const mapStateToProps = null;
const mapDispatchToProps = null;

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Html5Renderer);
