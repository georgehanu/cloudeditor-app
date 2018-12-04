const React = require("react");
const { connect } = require("react-redux");
const PropTypes = require("prop-types");
const randomColor = require("randomcolor");
const {
  scaledDisplayedPageSelector
} = require("../../../../stores/selectors/Html5Renderer");

const Zoom = require("../Zoom/Zoom");

require("./Canvas.css");

class Canvas extends React.Component {
  render() {
    const style = {
      backgroundColor: randomColor()
    };
    const { componentReady, getCanvasRef, ...otherProps } = this.props;
    let zoomContainer = null;
    if (componentReady) {
      zoomContainer = <Zoom {...otherProps} {...this.props.scaledPage} />;
    }
    return (
      <div style={style} className="canvasContainer" ref={getCanvasRef}>
        {zoomContainer}
      </div>
    );
  }
}
Canvas.propTypes = {
  viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  componentReady: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  scale: PropTypes.number,
  zoom: PropTypes.number,
  getCanvasRef: PropTypes.func,
  canvasRef: PropTypes.any
};

Canvas.defaultProps = {
  viewOnly: 0,
  componentReady: 0,
  scale: 1,
  zoom: 1,
  getCanvasRef: () => {},
  canvasRef: null
};

const mapStateToProps = state => {
  return {
    scaledPage: scaledDisplayedPageSelector(state)
  };
};

module.exports = connect(mapStateToProps)(Canvas);
