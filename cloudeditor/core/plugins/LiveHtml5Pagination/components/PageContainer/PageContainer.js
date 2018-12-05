const React = require("react");
const assign = require("object-assign");
const { debounce } = require("underscore");
const { hot } = require("react-hot-loader");
const { connect } = require("react-redux");
const randomColor = require("randomcolor");

const {
  createSelectorWithDependencies: createSelector,
  registerSelectors
} = require("reselect-tools");

const {
  displayedPageSelector,
  scaledDisplayedPageSelector
} = require("../../../../stores/selectors/Html5Renderer");
const { computeZoomScale } = require("../../../../utils/UtilUtils");
require("./PageContainer.css");
const Canvas = require("../../../../components/Renderer/Html5/Canvas/Canvas");

class PageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = null;
    this.canvasRef = null;
    this.state = {
      zoomScale: 1,
      containerWidth: 0,
      containerHeight: 0,
      pageReady: false
    };
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
        zoomScale: computeZoomScale(1, parent, child),
        containerWidth: parent.width,
        containerHeight: parent.height,
        pageReady: true
      });
    }
  };
  componentDidMount() {
    this.updateContainerDimensions();
    window.addEventListener("resize", debounce(this.updateContainerDimensions));
  }
  render() {
    console.log("testactivepage", this.props.activePage);
    const { classes, page_id, mode } = this.props;
    if (mode === "hide") return null;
    const { pageReady, containerWidth, containerHeight } = this.state;
    return (
      <div className={classes} style={{ borderColor: randomColor() }}>
        <Canvas
          getCanvasRef={this.getCanvasReference}
          getContainerRef={this.getContainerReference}
          activePage={this.props.activePage}
          zoomScale={this.state.zoomScale}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          pageReady={pageReady}
        />
      </div>
    );
  }
}

const makeMapStateToProps = (state, props) => {
  const activePage = (state, props) => {
    return props.page_id;
  };
  const pageSelector = createSelector(
    activePage,
    page_id => {
      console.log("selectot pageSelector", page_id);
      return [page_id];
    }
  );
  const getDisplayedPageSelector = displayedPageSelector(pageSelector);

  const mapStateToProps = (state, props) => {
    return {
      activePage: getDisplayedPageSelector(state, props)
    };
  };
  return mapStateToProps;
};

const PageContainerComponent = hot(module)(
  connect(makeMapStateToProps)(PageContainer)
);
module.exports = PageContainerComponent;
