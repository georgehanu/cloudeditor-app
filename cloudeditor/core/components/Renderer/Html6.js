const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");
const { debounce } = require("underscore");
const randomColor = require("randomcolor");

const Canvas = require("./Html5/Canvas/Canvas");

const { changeWorkareaProps } = require("../../stores/actions/ui");

const { zoomSelector, scaleSelector } = require("../../stores/selectors/ui");

require("./Html5.css");

updatePageOffset = (ref, { width, height }) => {
  const refContainer = ref;
  if (refContainer) {
    const child = {
        width: width,
        height: height
      },
      parent = {
        width: refContainer.offsetWidth,
        height: refContainer.offsetHeight
      };

    let scale = Math.min(
      parent.width / child.width,
      parent.height / child.height
    );

    return scale;
  }
};

class Html5Renderer extends React.Component {
  state = {
    componentReady: false,
    scale: 1
  };

  constructor(props) {
    super(props);
    this.canvas = null;
    this.pageContainerRef = React.createRef();
  }

  updatePageOffset = () => {
    const scale = updatePageOffset(this.canvas, this.props);
    this.setState({ scale: scale, componentReady: true });
  };

  componentDidMount() {
    this.updatePageOffset();
  }

  getCanvasReference = ref => {
    this.canvas = ref;
  };

  render() {
    const style = {
      backgroundColor: randomColor()
    };
    const { componentReady, scale } = this.state;
    const { zoom } = this.props;
    return (
      <Canvas
        {...this.props}
        scale={scale}
        componentReady={componentReady}
        getPageRef={this.pageContainerRef}
        getCanvasRef={this.getCanvasReference}
        canvasRef={this.canvas}
      />
    );
  }
}
Html5Renderer.propTypes = {
  viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  zoom: PropTypes.number
};

Html5Renderer.defaultProps = {
  viewOnly: 1,
  zoom: 1
};

module.exports = connect(
  null,
  null
)(Html5Renderer);
