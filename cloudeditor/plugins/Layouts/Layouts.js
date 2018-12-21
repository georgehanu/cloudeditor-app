const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const {
  layoutImagesSelector,
  layoutSelectedImageSelector
} = require("./store/selectors");
/*
const { UploadImage } = require("./components/UploadImage/UploadImage");
*/
const { layoutsSelectImage } = require("./store/actions");

const Gallery = require("../../core/components/Gallery/Gallery");

class Layouts extends React.Component {
  selectImageHandler = imageId => {
    this.props.layoutsSelectImage(imageId);
  };

  render() {
    return (
      <div className="LayoutsContainer">
        <Gallery
          items={this.props.layoutImages}
          hideActions={true}
          selectImage={this.selectImageHandler}
          selectedId={this.props.layoutSelectedImage}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    layoutImages: layoutImagesSelector(state),
    layoutSelectedImage: layoutSelectedImageSelector(state)
    /*loading: uploadedLoadingSelector(state),
    loadingImages: uploadedImagesLoadingImagesSelector(state)*/
  };
};

const mapDispatchToProps = dispatch => {
  return {
    layoutsSelectImage: imageId => dispatch(layoutsSelectImage(imageId))
  };
};

const LayoutsPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("layouts")(Layouts));

module.exports = {
  Layouts: assign(LayoutsPlugin, {
    SideBar: {
      position: 4,
      priority: 1,
      text: "Layouts",
      icon: "printqicon-layouts",
      showMore: true,
      tooltip: { title: "Layouts", description: "Layouts" }
    }
  }),
  reducers: { layouts: require("./store/reducers") }
};
