const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
/*
const {
  uploadedImagesSelector,
  uploadedImagesLoadingImagesSelector,
  uploadedLoadingSelector
} = require("./store/selectors");
const { uploadImageStart, removeImageFromGallery } = require("./store/actions");
*/

class ZoomOut extends React.Component {
  render() {
    return <div className="ZoomOut" />;
  }
}

const mapStateToProps = state => {
  return {
    /*uploadedImages: uploadedImagesSelector(state),
    loading: uploadedLoadingSelector(state),
    loadingImages: uploadedImagesLoadingImagesSelector(state)*/
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /*uploadImageStart: files => dispatch(uploadImageStart(files)),
    removeImageFromGallery: id => dispatch(removeImageFromGallery(id))*/
  };
};

const ZoomOutPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(ZoomOut);

module.exports = {
  ZoomOut: assign(ZoomOutPlugin, {
    SideBar: {
      position: 6,
      priority: 1,
      text: "Zoom Out",
      icon: "printqicon-zoom_out",
      showMore: false
    }
  })
  //reducers: { uiAddImage: require("./store/reducers") },
  //epics: require("./store/epics")
};
