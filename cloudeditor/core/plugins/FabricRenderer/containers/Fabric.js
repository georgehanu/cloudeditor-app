const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");
const { debounce } = require("underscore");
const randomColor = require("randomcolor");
const { hot } = require("react-hot-loader");

const Canvas = require("../components/Canvas/Canvas");
const { computeScale } = require("../../../utils/UtilUtils");

const { changeWorkareaProps } = require("../../../stores/actions/ui");
const {
  displayedPageSelector,
  activeGroupSelector
} = require("../../../stores/selectors/Html5Renderer");
const {
  canvasSelector,
  scaleSelector
} = require("../../../stores/selectors/ui");

require("./Fabric.css");

class Fabric extends React.Component {
  state = {
    pageReady: false
  };

  constructor(props) {
    super(props);
    this.containerRef = null;
  }

  getContainerReference = ref => {
    this.containerRef = ref;
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

      const scale = computeScale(parent, child);

      this.props.changeWorkAreaPropsHandler({
        scale: scale,
        canvas: {
          workingWidth: parent.width,
          workingHeight: parent.height
        }
      });

      this.setState({
        pageReady: true
      });
    }
  };

  componentDidMount() {
    this.updateContainerDimensions();
    window.addEventListener("resize", this.updateContainerDimensions);
  }
  componentDidUpdate() {}

  render() {
    const style = {
      backgroundColor: randomColor()
    };
    const { pageReady } = this.state;
    const { scale, canvasDimm } = this.props;
    return (
      <Canvas
        getContainerRef={this.getContainerReference}
        activePage={this.props.activePage}
        scale={scale}
        containerWidth={canvasDimm.workingWidth}
        containerHeight={canvasDimm.workingHeight}
        pageReady={pageReady}
      />
    );
  }
}
Fabric.propTypes = {};

Fabric.defaultProps = {};

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
      scale: scaleSelector(state, props)
    };
  };
  return mapStateToProps;
};

module.exports = hot(module)(
  connect(
    makeMapStateToProps,
    mapDispatchToProps
  )(Fabric)
);
