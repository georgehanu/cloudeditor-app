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
  render() {
    return (
      <div className="projectPreviewContainer">
        <div className="previewContainer">
          {this.props.previewPageUrl && (
            <ImagePreview
              imgSrc={this.props.previewPageUrl}
              loading={this.props.loading}
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
