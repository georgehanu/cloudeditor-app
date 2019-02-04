const React = require("react");
const { withNamespaces } = require("react-i18next");
const Dropzone = require("react-dropzone").default;
/*
const {
    dagLoadingSelector,
    dagErrorMessageSelector,
    dagImagePathSelector,
    dagShowUploadImageSelector
} = require("../../../store/selectors");

const { dagUploadImage } = require("../../../store/actions");*/
const { connect } = require("react-redux");

class UploadImage extends React.Component {
  state = { files: [] };

  onDrop = (acceptedFiles, rejectedFile) => {
    if (acceptedFiles.length === 0) {
      return;
    }
    this.props.uploadImage(acceptedFiles);
  };

  onCancel = () => {
    this.setState({
      files: []
    });
  };

  render() {
    return (
      <section className="dropzone">
        <div className="dropzone">
          <Dropzone
            onDrop={this.onDrop}
            onFileDialogCancel={this.onCancel}
            multiple={true}
            accept="image/*"
            className="Dropzone"
          >
            <div className="UploadFileInputs">
              <label htmlFor="image-file-upload" className="UploadLabel">
                <span className="UploadIcon icon printqicon-upload" />
                <span className="UploadMessage">
                  {this.props.t("Upload your own")}
                </span>
              </label>
            </div>
          </Dropzone>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

const UploadImagePlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("addImage")(UploadImage));

module.exports = { UploadImage: UploadImagePlugin };
