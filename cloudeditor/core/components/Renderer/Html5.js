const React = require("react");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const { forEach } = require("ramda");

const withPageGroups = require("../../hoc/renderer/withPageGroups");
const { withNamespaces } = require("react-i18next");

const Canvas = require("./Html5/Canvas/Canvas");
const { computeZoomScale } = require("../../utils/UtilUtils");

const { changeWorkareaProps } = require("../../stores/actions/ui");
const { removeSelection, changePage } = require("../../stores/actions/project");
const GlobalLoading = require("./Html5/GlobalLoading/GlobalLoading");
const {
  getLoadingStatusSelector,
  getEnabledStatusSelector
} = require("../../stores/selectors/globalLoading");
const {
  displayedPageSelector,
  groupsSelector,
  activeGroupSelector,
  getSelectedObjectsLengthSelector,
  displayedPagesLabelsSelector
} = require("../../stores/selectors/Html5Renderer");
const {
  activePageIdSelector,
  includeBoxesSelector,
  allowSafeCutSelector
} = require("../../stores/selectors/project");
const {
  canvasSelector,
  zoomSelector,
  permissionsSelector,
  rerenderIdSelector
} = require("../../stores/selectors/ui");

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

  blurAction = event => {
    const { selectedLength } = this.props;
    if (!selectedLength) return false;
    let isBlur = true;
    const target = event.target;
    const { blurSelectors } = this.props;
    forEach(blurselector => {
      const elements = document.getElementsByClassName(blurselector);
      forEach(element => {
        if (element === target) {
          isBlur = false;
        }
        if (element.contains(target)) {
          isBlur = false;
        }
      }, elements);
    }, blurSelectors);
    if (isBlur) {
      this.props.onRemoveActiveBlockHandler({});
    }
  };
  updateContainerDimensions = () => {
    let containerRef = this.containerRef;
    if (!containerRef) {
      containerRef = document.querySelectorAll(
        ".renderContainer .zoomContainer"
      )[0];
    }
    if (containerRef) {
      const parent = {
        width: containerRef.offsetWidth,
        height: containerRef.offsetHeight
      };
      const child = {
        width: this.props.activePage.width,
        height: this.props.activePage.height
      };
      const boundingContainer = containerRef.getBoundingClientRect();
      this.setState({
        zoomScale: computeZoomScale(this.props.zoom, parent, child),
        bottomContainer: boundingContainer.bottom,
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.zoom !== this.props.zoom) {
      this.updateContainerDimensions();
    }
    if (prevProps.rerenderId !== this.props.rerenderId) {
      this.updateContainerDimensions();
    }
    if (prevProps.activePageId !== this.props.activePageId) {
      this.updateContainerDimensions();
    }
  }
  setMissingImages = () => {};
  deleteMissingImages = () => {};

  componentDidMount() {
    this.updateContainerDimensions();
    //window.addEventListener("resize", debounce(this.updateContainerDimensions));
    window.addEventListener("resize", this.updateContainerDimensions);
    window.addEventListener("resizePage", this.updateContainerDimensions);
    document.addEventListener("mousedown", this.blurAction);
    window.addEventListener("beforeunload", event => {
      const { alertOnExit } = this.props.permissions;
      if (alertOnExit) {
        event.preventDefault();
        return (event.returnValue = "Are you sure you want to close");
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateContainerDimensions);
    window.removeEventListener("resizePage", this.updateContainerDimensions);
    document.removeEventListener("mousedown", this.blurAction);
  }

  render() {
    const { pageReady } = this.state;
    let globalSpinner = null;
    if (this.props.globalSpinnerEnabled) {
      globalSpinner = (
        <div className={"globalSpinner"}>
          <GlobalLoading />
        </div>
      );
    }
    return (
      <React.Fragment>
        {globalSpinner}
        <Canvas
          containerUuid={this.props.uuid}
          getCanvasRef={this.getCanvasReference}
          getContainerRef={this.getContainerReference}
          activePage={this.props.activePage}
          zoomScale={this.state.zoomScale}
          zoom={this.props.zoom}
          containerWidth={this.props.canvasDimm.workingWidth}
          containerHeight={this.props.canvasDimm.workingHeight}
          bottomContainer={this.state.bottomContainer}
          pageReady={pageReady}
          labels={this.props.labels}
          activePageId={this.props.activePageId}
          rerenderId={this.props.rerenderId}
          viewOnly={0}
          onChangePage={this.props.onChangePageHandler}
          deleteMissingImages={this.deleteMissingImages}
          setMissingImages={this.setMissingImages}
          t={this.props.t}
        />
      </React.Fragment>
    );
  }
}
Html5.propTypes = {};

Html5.defaultProps = {};

const mapDispatchToProps = dispatch => {
  return {
    changeWorkAreaPropsHandler: payload =>
      dispatch(changeWorkareaProps(payload)),
    onRemoveActiveBlockHandler: payload => dispatch(removeSelection(payload)),
    onChangePageHandler: payload => dispatch(changePage(payload))
  };
};

const makeMapStateToProps = (state, props) => {
  const facingPagesSelector = (state, props) => {
    return props.facingPages || 1;
  };
  const displayOnePageSelector = (state, props) => {
    return props.displayOnePage || 1;
  };

  const getGroupsSelector = groupsSelector(facingPagesSelector);
  const getActiveGroupSelector = activeGroupSelector(getGroupsSelector);

  const getDisplayedPageSelector = displayedPageSelector(
    displayOnePageSelector,
    getActiveGroupSelector,
    activePageIdSelector,
    includeBoxesSelector,
    allowSafeCutSelector
  );

  const mapStateToProps = (state, props) => {
    return {
      activePage: getDisplayedPageSelector(state, props),
      canvasDimm: canvasSelector(state, props),
      labels: displayedPagesLabelsSelector(state, props),
      zoom: zoomSelector(state),
      selectedLength: getSelectedObjectsLengthSelector(state),
      rerenderId: rerenderIdSelector(state),
      activePageId: activePageIdSelector(state, props),
      permissions: permissionsSelector(state, props),
      globalSpinnerEnabled: getLoadingStatusSelector(state)
    };
  };
  return mapStateToProps;
};

module.exports = hot(module)(
  connect(
    makeMapStateToProps,
    mapDispatchToProps
  )(withPageGroups(withNamespaces("translate")(Html5)))
);
