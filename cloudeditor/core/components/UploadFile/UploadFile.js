const React = require("react");
const { withNamespaces } = require("react-i18next");
const Dropzone = require("react-dropzone").default;
const { uploadAssetStart } = require("../../stores/actions/assets");
const { connect } = require("react-redux");

class UploadFile extends React.PureComponent {
  state = { files: [] };
  onDrop = (acceptedFiles, rejectedFile) => {
    if (acceptedFiles.length === 0) {
      return;
    }
    this.props.onAssetStartUploadHandler({
      type: this.props.type,
      files: acceptedFiles
    });
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
            accept={this.props.acceptedFiles}
            type={this.props.type}
            className="dropzone"
          >
            <div className="uploadFileInputs">
              <label htmlFor="image-file-upload" className="uploadLabel">
                <span className="uploadIcon icon printqicon-upload" />
                <span className="uploadMessage">
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
const mapDispatchToProps = dispatch => {
  return {
    onAssetStartUploadHandler: files => dispatch(uploadAssetStart(files))
  };
};

module.exports = connect(
  null,
  mapDispatchToProps
)(UploadFile);
