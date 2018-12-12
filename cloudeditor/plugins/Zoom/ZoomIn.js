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
*/
const { zoomChangeZoom } = require("./store/actions");
const zoomStore = require("./store/reducers");

class ZoomIn extends React.Component {
  render() {
    return <div className="ZoomIn" />;
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

const ZoomInPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(ZoomIn);

module.exports = {
  ZoomIn: assign(ZoomInPlugin, {
    SideBar: {
      position: 5,
      priority: 1,
      text: "Zoom In",
      icon: "printqicon-zoom_in",
      showMore: false,
      handleAction: true
    }
  }),
  reducers: { zoom: require("./store/reducers") }
  //epics: require("./store/epics")
};
