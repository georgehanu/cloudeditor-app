const React = require("react");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");
const { connect } = require("react-redux");
const ImagePreview = require("./components/ImagePreview");
require("./PrintPreview.css");

const {
  previewLoadingSelector,
  previewPageUrlSelector
} = require("./store/selectors");

class PrintPreview extends React.Component {
  onMouseEnterHandler = () => {
    this.props.addContainerClasses("PrintPreviewMagnifier", [
      "containerPrintPreviewMaxZindex"
    ]);
  };
  onMouseLeaveHandler = () => {
    this.props.addContainerClasses("PrintPreviewMagnifier", []);
  };

  render() {
    return (
      <div className="projectPreviewContainer">
        <div className="previewContainer">
          {this.props.previewPageUrl && (
            <ImagePreview
              imgSrc={this.props.previewPageUrl}
              loading={this.props.loading}
              onMouseEnterHandler={this.onMouseEnterHandler}
              onMouseLeaveHandler={this.onMouseLeaveHandler}
            />
          )}
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
