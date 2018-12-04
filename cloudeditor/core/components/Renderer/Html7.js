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
    componentReady: false
  };

  constructor(props) {
    super(props);
    this.canvas = null;
    this.pageContainerRef = React.createRef();
    this.updatePageOffset = this.updatePageOffset.bind(this);
  }

  getCanvasReference = ref => {
    this.canvas = ref;
  };

  updatePageOffset() {
    const scale = updatePageOffset(this.canvas, this.props);
    this.updateWorkArea(scale);
    this.setState({ componentReady: true }, () => {});
  }

  updateWorkArea(scale) {
    const canvasContainer = this.canvas;
    const pageContainer = this.pageContainerRef.current;

    if (!canvasContainer || !pageContainer) return false;
    const pageContainerBounding = pageContainer.getBoundingClientRect();
    const canvasContainerParent = canvasContainer.parentElement.getBoundingClientRect();
    const workArea = {
      scale,
      pageOffset: {
        x: pageContainerBounding.x - canvasContainerParent.x,
        y: pageContainerBounding.y - canvasContainerParent.y
      }
    };

    this.props.changeWorkAreaPropsHandler(workArea);
  }

  componentDidMount() {
    this.updatePageOffset();
    window.addEventListener("resize", debounce(this.updatePageOffset));
  }
  componentDidUpdate() {
    console.log("canvasContainerRef", this.canvas);
    console.log("pageRefContent", this.pageContainerRef.current);
  }

  render() {
    const style = {
      backgroundColor: randomColor()
    };
    const { componentReady } = this.state;
    const { scale, zoom } = this.props;
    return (
      <Canvas
        {...this.props}
        componentReady={componentReady}
        getPageRef={this.pageContainerRef}
        getCanvasRef={this.getCanvasReference}
        canvasRef={this.canvas}
      />
    );
  }
}
Html5Renderer.propTypes = {
  scale: PropTypes.number,
  zoom: PropTypes.number
};

Html5Renderer.defaultProps = {
  scale: 1,
  zoom: 1
};

const mapStateToProps = state => {
  return {
    zoom: zoomSelector(state),
    scale: scaleSelector(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    changeWorkAreaPropsHandler: payload =>
      dispatch(changeWorkareaProps(payload))
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Html5Renderer);
