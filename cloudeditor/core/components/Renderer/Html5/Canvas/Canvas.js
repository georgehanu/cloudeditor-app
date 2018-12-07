const React = require("react");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const PropTypes = require("prop-types");
const randomColor = require("randomcolor");

const Zoom = require("../Zoom/Zoom");

require("./Canvas.css");

class Canvas extends React.Component {
  render() {
    const style = {
      backgroundColor: randomColor()
    };
    const { getCanvasRef, ...otherProps } = this.props;
    return (
      <div style={style} className="canvasContainer" ref={getCanvasRef}>
        <Zoom {...otherProps} />
      </div>
    );
  }
}
Canvas.propTypes = {
  viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  getCanvasRef: PropTypes.func,
  getContainerRef: PropTypes.func,
  activePage: PropTypes.object,
  zoomScale: PropTypes.number,
  pageReady: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
};

Canvas.defaultProps = {
  viewOnly: 0,
  getCanvasRef: () => {},
  getContainerRef: () => {},
  activePage: {},
  zoomScale: 1,
  pageReady: false
};

const CanvasComponent = hot(module)(connect(null)(Canvas));
module.exports = CanvasComponent;