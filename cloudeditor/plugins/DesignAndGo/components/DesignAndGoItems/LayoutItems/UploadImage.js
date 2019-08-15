const React = require("react");
const { withNamespaces } = require("react-i18next");
const Dropzone = require("react-dropzone").default;

const {
  dagLoadingSelector,
  dagErrorMessageSelector,
  dagImagePathSelector,
  dagShowUploadImageSelector
} = require("../../../store/selectors");

const { dagUploadImage } = require("../../../store/actions");
const { connect } = require("react-redux");

class UploadImage extends React.Component {
  state = { files: [] };

  onDrop = (acceptedFile, rejectedFile) => {
    if (acceptedFile.length === 0) {
      return;
    }
    this.props.uploadImage(acceptedFile[0]);
  };

  onCancel = () => {
    this.setState({
      files: []
    });
  };

  render() {
    const show = true; //this.props.alwaysShow ? true : this.props.showUploadImage;
    const { t } = this.props;
    return (
      <section className="dropzone">
        {show && (
          <div className="dropzoneContainer">
            <Dropzone
              onDrop={this.onDrop}
              onFileDialogCancel={this.onCancel}
              multiple={false}
              accept="image/*"
              className="Dropzone"
            >
              <div className="UploadFileInputs dgButton">
                <label className="label">
                  {this.props.loading && (
                    <div className="sk-circle">
                      <div className="sk-circle1 sk-child" />
                      <div className="sk-circle2 sk-child" />
                      <div className="sk-circle3 sk-child" />
                      <div className="sk-circle4 sk-child" />
                      <div className="sk-circle5 sk-child" />
                      <div className="sk-circle6 sk-child" />
                      <div className="sk-circle7 sk-child" />
                      <div className="sk-circle8 sk-child" />
                      <div className="sk-circle9 sk-child" />
                      <div className="sk-circle10 sk-child" />
                      <div className="sk-circle11 sk-child" />
                      <div className="sk-circle12 sk-child" />
                    </div>
                  )}
                  <span className="message">{t("Upload Your Image")}</span>
                </label>
                {this.props.errorMessage && (
                  <div>{this.props.errorMessage}</div>
                )}
              </div>
            </Dropzone>
          </div>
        )}
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: dagLoadingSelector(state),
    imagePath: dagImagePathSelector(state),
    errorMessage: dagErrorMessageSelector(state),
    showUploadImage: dagShowUploadImageSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    uploadImage: image => dispatch(dagUploadImage({ image }))
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("designAndGo")(UploadImage));
