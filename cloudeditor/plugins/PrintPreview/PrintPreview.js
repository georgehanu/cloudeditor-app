const React = require("react");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");
const { connect } = require("react-redux");
const ImagePreview = require("./components/ImagePreview");
const { debounce } = require("underscore");

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

  constructor(props) {
    super(props);
    this.previewContainer = React.createRef();
  }

  onMouseEnterHandler = () => {
    this.props.addContainerClasses("PrintPreviewMagnifier", [
      "containerPrintPreviewMaxZindex"
    ]);
  };
  onMouseLeaveHandler = () => {
    this.props.addContainerClasses("PrintPreviewMagnifier", []);
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
    return (
      <div className="projectPreviewContainer">
        <div className="previewContainer">
          <div
            className="previewImagecontainer"
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
    loading: previewLoadingSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const PrintPreviewPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("printPreview")(PrintPreview));

module.exports = {
  PrintPreview: assign(PrintPreviewPlugin),
  reducers: { preview: require("./store/reducers") },
  epics: require("./store/epics")
};
