const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const {
  UploadImage
} = require("../AddImage/components/UploadImage/UploadImage");

const {
  uploadedPdfsSelector,
  uploadedPdfLoadingPdfSelector,
  uploadedLoadingSelector
} = require("./store/selectors");
const { uploadPdfStart, removePdfFromGallery } = require("./store/actions");

const Gallery = require("../../core/components/Gallery/Gallery");
class AddPdf extends React.Component {
  deleteImageHandler = id => {
    if (id === undefined) return;

    this.props.removePdfFromGallery({ id });
  };

  selectImageHandler = index => {};

  render() {
    return (
      <div className="UploadContainer">
        <UploadImage uploadImage={this.props.uploadPdfStart} />

        <Gallery
          items={this.props.uploadedPdfs}
          deleteImage={this.deleteImageHandler}
          selectImage={this.selectImageHandler}
          loadingNr={this.props.loadingPdfs}
          loading={this.props.loading}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    uploadedPdfs: uploadedPdfsSelector(state),
    loading: uploadedLoadingSelector(state),
    loadingPdfs: uploadedPdfLoadingPdfSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    uploadPdfStart: files => dispatch(uploadPdfStart(files)),
    removePdfFromGallery: id => dispatch(removePdfFromGallery(id))
  };
};

const AddPdfPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("addPdf")(AddPdf));

module.exports = {
  AddPdf: assign(AddPdfPlugin, {
    disablePluginIf:
      "{store().getState().project.title==='Empty Project!!@!!@!@'}",
    SideBar: {
      position: 3,
      priority: 1,
      text: "Pdf",
      icon: "printqicon-layouts",
      showMore: true,
      tooltip: { title: "Add Pdf", description: "Add a new pdf block" }
    }
  }),
  reducers: { uiAddPdf: require("./store/reducers") },
  epics: require("./store/epics")
};
