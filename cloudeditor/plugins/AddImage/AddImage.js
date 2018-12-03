const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const { UploadImage } = require("./components/UploadImage/UploadImage");
const {
  uploadedImagesSelector,
  uploadedImagesLoadingImagesSelector,
  uploadedLoadingSelector
} = require("./store/selectors");
const { uploadImageStart, removeImageFromGallery } = require("./store/actions");

const Gallery = require("./components/Gallery/Gallery");

class AddImage extends React.Component {
  deleteImageHandler = id => {
    if (id === undefined) return;

    this.props.removeImageFromGallery({ id });
  };

  selectImageHandler = index => {};

  render() {
    return (
      <div className="UploadContainer">
        <UploadImage uploadImage={this.props.uploadImageStart} />

        <Gallery
          items={this.props.uploadedImages}
          deleteImage={this.deleteImageHandler}
          selectImage={this.selectImageHandler}
          loadingNr={this.props.loadingImages}
          loading={this.props.loading}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    uploadedImages: uploadedImagesSelector(state),
    loading: uploadedLoadingSelector(state),
    loadingImages: uploadedImagesLoadingImagesSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    uploadImageStart: files => dispatch(uploadImageStart(files)),
    removeImageFromGallery: id => dispatch(removeImageFromGallery(id))
  };
};

AddImage.defaultProps = {
  id: "addImage-wrapper"
};

const AddImagePlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("addImage")(AddImage));

module.exports = {
  AddImage: assign(AddImagePlugin, {
    disablePluginIf:
      "{store().getState().project.title==='Empty Project!!@!!@!@'}",
    SideBar: {
      position: 3,
      priority: 1,
      text: "Add Image",
      icon: "printqicon-newimage",
      showMore: true,
      tooltip: { title: "Add Image", description: "Add a new image block" }
    }
  }),
  reducers: { uiAddImage: require("./store/reducers") },
  epics: require("./store/epics")
};
