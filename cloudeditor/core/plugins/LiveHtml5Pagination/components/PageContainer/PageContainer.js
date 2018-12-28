const React = require("react");
const assign = require("object-assign");
const { debounce } = require("underscore");
const { hot } = require("react-hot-loader");
const { connect } = require("react-redux");
const randomColor = require("randomcolor");
const { DragSource, DropTarget } = require("react-dnd");
const PAGES = "PAGES";
const {
  /*  createSelectorWithDependencies: createSelector, */
  registerSelectors
} = require("reselect-tools");
const {
  createDeepEqualSelector: createSelector
} = require("../../../../rewrites/reselect/createSelector");
const {
  displayedPageSelector,
  displayedPageLabelsSelector
} = require("../../../../stores/selectors/Html5Renderer");
const { computeZoomScale } = require("../../../../utils/UtilUtils");
require("./PageContainer.css");
const Canvas = require("../../../../components/Renderer/Html5/Canvas/Canvas");
const {
  changePage,
  deletePage
} = require("../../../../stores/actions/project");

const PageSource = {
  beginDrag(props) {
    props.highlightHoverPage(null);
    return {
      type: PAGES,
      page_id: props.page_id,
      draggable: props.activePage.lockPosition || true
    };
  },
  canDrag(props, monitor) {
    if (props.activePage.lockPosition === false) {
      return false;
    }
    return true;
  }
};

const PageTarget = {
  drop(props, monitor) {
    props.switchPages(monitor.getItem().page_id, props.page_id);
    props.highlightHoverPage(null);
  },

  canDrop(props, monitor) {
    if (props.activePage.lockPosition === false) {
      return false;
    }
    return true;
  },
  hover(props, monitor) {
    if (
      props.page_id === monitor.getItem().page_id ||
      props.activePage.lockPosition === false
    ) {
      props.highlightHoverPage(null);
    } else {
      props.highlightHoverPage(props.page_id);
    }
  }
};

collectDrag = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

collectDrop = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
};

class PageContainer extends React.PureComponent {
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
      const activePageRaport =
        this.props.activePage.height / this.props.activePage.width;
      const parent = {
        width: this.containerRef.offsetHeight * activePageRaport,
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
  componentDidUpdate() {
    this.updateContainerDimensions();
  }
  clickHandler = () => {
    if (this.props.activePage.selectable) {
      const { page_id } = this.props;
      this.props.onChangePage({ page_id });
    }
  };
  onDeletePageHandler = event => {
    event.stopPropagation();
    if (this.props.activePage.allowDeletePage) {
      const { page_id } = this.props;
      this.props.onDeletePage({ page_id });
    }
  };
  render() {
    const { classes, mode } = this.props;
    // if (mode === "minimized") return null;
    const { pageReady, containerWidth, containerHeight } = this.state;
    let style = {};
    if (this.containerRef) {
      const activePageRaport =
        this.props.activePage.height / this.props.activePage.width;
      const width = this.containerRef.offsetHeight * activePageRaport + 2;
      style = { width, minWidth: width };
    }

    return this.props.connectDropTarget(
      this.props.connectDragSource(
        <div className={classes} style={style} onClick={this.clickHandler}>
          <a
            onClick={event => {
              this.onDeletePageHandler(event);
            }}
            href="javascript:void(0)"
            className={[
              "deletePage",
              !this.props.activePage.allowDeletePage ? "hide" : ""
            ].join(" ")}
          >
            x
          </a>
          <Canvas
            getCanvasRef={this.getCanvasReference}
            getContainerRef={this.getContainerReference}
            activePage={this.props.activePage}
            viewOnly={1}
            zoomScale={this.state.zoomScale}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            pageReady={pageReady}
          />
          <div className="singlePageText">
            {this.props.pageLabels.longLabel}
          </div>
        </div>
      )
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
      return [page_id];
    }
  );
  const getDisplayedPageSelector = displayedPageSelector(pageSelector);
  const getDisplayedPageLabelsSelector = displayedPageLabelsSelector(
    activePage
  );

  const mapStateToProps = (state, props) => {
    return {
      activePage: getDisplayedPageSelector(state, props),
      pageLabels: getDisplayedPageLabelsSelector(state, props)
    };
  };
  return mapStateToProps;
};
const mapDispatchToProps = dispatch => {
  return {
    onChangePage: payload => dispatch(changePage(payload)),
    onDeletePage: payload => dispatch(deletePage(payload))
  };
};
module.exports = hot(module)(
  connect(
    makeMapStateToProps,
    mapDispatchToProps
  )(
    DropTarget(PAGES, PageTarget, collectDrop)(
      DragSource(PAGES, PageSource, collectDrag)(PageContainer)
    )
  )
);
