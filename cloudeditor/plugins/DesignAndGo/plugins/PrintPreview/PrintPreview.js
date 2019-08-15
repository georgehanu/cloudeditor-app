const React = require("react");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");
const { connect } = require("react-redux");
const ImagePreview = require("./components/ImagePreview");
const { debounce } = require("underscore");
const { zoomSelector } = require("../../../../core/stores/selectors/ui");
const {
  pagesOrderSelector,
  activePageIdSelector
} = require("../../../../core/stores/selectors/project");
const { previewLoadPage } = require("./store/actions");
require("./PrintPreview.css");

const {
  previewLoadingSelector,
  previewPageUrlSelector
} = require("./store/selectors");

class PrintPreview extends React.Component {
  state = {
    previewPageUrl: null,
    imageContainerWidth: null,
    imageContainerHeight: null
  };
  onClickChangePageHandler = page_id => {
    this.props.onChangePage({
      page_id
    });
  };
  constructor(props) {
    super(props);
    this.previewContainer = React.createRef();
  }

  onMouseEnterHandler = () => {
    this.props.addContainerClasses(
      "PrintPreviewMagnifier",
      ["containerPrintPreviewMaxZindex"],
      false
    );
  };
  onMouseLeaveHandler = () => {
    this.props.addContainerClasses("PrintPreviewMagnifier", [], false);
  };

  componentDidMount() {
    this.updatePrintPreview();
    window.addEventListener("resize", debounce(this.updatePrintPreview));
    window.addEventListener("resizePage", this.updatePrintPreview);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updatePrintPreview);
    window.removeEventListener("resizePage", this.updatePrintPreview);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const parentContainer = document.getElementById("previewImagecontainerId");

    if (parentContainer === null) {
      return {
        ...prevState,
        previewPageUrl: nextProps.previewPageUrl
      };
    }
    const parentDimension = parentContainer.getBoundingClientRect();

    if (
      nextProps.previewPageUrl !== prevState.previewPageUrl ||
      parentDimension.width !== prevState.width ||
      parentDimension.height !== prevState.height
    ) {
      return {
        previewPageUrl: nextProps.previewPageUrl,
        imageContainerWidth: parentDimension.width,
        imageContainerHeight: parentDimension.height
      };
    }

    return null;
  }

  updatePrintPreview = () => {
    if (this.previewContainer.current === null) return;
    let parentDimension = this.previewContainer.current.getBoundingClientRect();

    this.setState({ imageContainerWidth: parentDimension.width });
    this.setState({ imageContainerHeight: parentDimension.height });

    return this.state;
  };

  render() {
    const { pagesOrder, activePageId } = this.props;
    let nextPage = false;
    let prevPage = false;
    const currentPosition = pagesOrder.indexOf(activePageId);
    if (currentPosition + 2 <= pagesOrder.length) {
      nextPage = pagesOrder[currentPosition + 1];
    }
    if (currentPosition !== 0) {
      prevPage = pagesOrder[currentPosition - 1];
    }
    const previewImagecontainer =
      "previewImagecontainer " +
      (this.props.zoomValue < 1.05 ? "" : "previewImagecontainerOverflow");
    return (
      <div className="projectPreviewContainer">
        <div className="previewContainer">
          <div
            className={previewImagecontainer}
            id="previewImagecontainerId"
            ref={this.previewContainer}
            onMouseEnter={this.onMouseEnterHandler}
            onMouseLeave={this.onMouseLeaveHandler}
          >
            <ImagePreview
              imgSrc={this.props.previewPageUrl}
              loading={this.props.loading}
              onMouseEnterHandler={this.onMouseEnterHandler}
              onMouseLeaveHandler={this.onMouseLeaveHandler}
              width={this.state.imageContainerWidth}
              height={this.state.imageContainerHeight}
              previewPageUrl={this.props.previewPageUrl}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    previewPageUrl: previewPageUrlSelector(state),
    loading: previewLoadingSelector(state),
    zoomValue: zoomSelector(state),
    pagesOrder: pagesOrderSelector(state),
    activePageId: activePageIdSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangePage: payload => dispatch(previewLoadPage(payload))
  };
};
const PrintPreviewPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("DesignAndGo/printPreview")(PrintPreview));

module.exports = {
  DGPrintPreview: assign(PrintPreviewPlugin, {
    DesignAndGo: {
      position: 1,
      priority: 1,
      target: "Layout",
      rightPanel: 0,
      leftPanel: 1
    }
  }),
  reducers: { preview: require("./store/reducers") },
  epics: require("./store/epics")
};
