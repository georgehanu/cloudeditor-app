const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");
const { debounce } = require("underscore");
const randomColor = require("randomcolor");
const { hot } = require("react-hot-loader");

const Canvas = require("./Html5/Canvas/Canvas");
const { computeZoomScale } = require("../../utils/UtilUtils");

const { changeWorkareaProps } = require("../../stores/actions/ui");
const {
  displayedPageSelector,
  activeGroupSelector
} = require("../../stores/selectors/Html5Renderer");
const { canvasSelector, zoomSelector } = require("../../stores/selectors/ui");

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

class Html5 extends React.Component {
  state = {
    zoomScale: 1,
    pageReady: false
  };

  constructor(props) {
    super(props);
    this.containerRef = null;
    this.canvasRef = null;
  }

  getContainerReference = ref => {
    this.containerRef = ref;
  };
  getCanvasReference = ref => {
    this.canvasRef = ref;
  };

  updateContainerDimensions = () => {
    if (this.containerRef) {
      const parent = {
        width: this.containerRef.offsetWidth,
        height: this.containerRef.offsetHeight
      };
      const child = {
        width: this.props.activePage.width,
        height: this.props.activePage.height
      };
      this.setState({
        zoomScale: computeZoomScale(this.props.zoom, parent, child),
        pageReady: true
      });

      this.props.changeWorkAreaPropsHandler({
        canvas: {
          workingWidth: parent.width,
          workingHeight: parent.height
        }
      });
    }
  };

  getCanvasReference = ref => {
    this.canvas = ref;
  };

  componentDidMount() {
    this.updateContainerDimensions();
    //window.addEventListener("resize", debounce(this.updateContainerDimensions));
    window.addEventListener("resize", this.updateContainerDimensions);
  }
  componentDidUpdate() {}

  render() {
    const style = {
      backgroundColor: randomColor()
    };
    const { pageReady } = this.state;
    return (
      <Canvas
        getCanvasRef={this.getCanvasReference}
        getContainerRef={this.getContainerReference}
        activePage={this.props.activePage}
        zoomScale={this.state.zoomScale}
        containerWidth={this.props.canvasDimm.workingWidth}
        containerHeight={this.props.canvasDimm.workingHeight}
        pageReady={pageReady}
      />
    );
  }
}
Html5.propTypes = {};

Html5.defaultProps = {};

const mapDispatchToProps = dispatch => {
  return {
    changeWorkAreaPropsHandler: payload =>
      dispatch(changeWorkareaProps(payload))
  };
};

const makeMapStateToProps = (state, props) => {
  const getDisplayedPageSelector = displayedPageSelector(activeGroupSelector);

  const mapStateToProps = (state, props) => {
    return {
      activePage: getDisplayedPageSelector(state, props),
      canvasDimm: canvasSelector(state, props),
      zoom: zoomSelector(state)
    };
  };
  return mapStateToProps;
};

module.exports = hot(module)(
  connect(
    makeMapStateToProps,
    mapDispatchToProps
  )(Html5)
);
