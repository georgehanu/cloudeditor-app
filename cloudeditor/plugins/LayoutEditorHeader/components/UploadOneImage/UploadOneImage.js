const React = require("react");
const Dropzone = require("react-dropzone").default;
const ACCEPTED_FILES = "image/*";

class UploadOneImage extends React.Component {
  state = { files: [] };
  onDrop = (acceptedFiles, rejectedFile) => {
    if (acceptedFiles.length === 0) {
      return;
    }
    console.log(acceptedFiles);
  };

  onCancel = () => {
    this.setState({
      files: []
    });
  };

  render() {
    return (
      <div className="dropzone headerSubContainer">
        <Dropzone
          onDrop={this.onDrop}
          onFileDialogCancel={this.onCancel}
          multiple={false}
          accept={ACCEPTED_FILES}
          className="dropzone"
        >
          <div className="uploadFileInputs">
            <label htmlFor="image-file-upload" className="uploadLabel">
              <span className="uploadIcon icon printqicon-upload" />
              <span className="uploadMessage">
                {this.props.t("Upload your image")}
              </span>
            </label>
          </div>
        </Dropzone>
      </div>
    );
  }
}

module.exports = UploadOneImage;
