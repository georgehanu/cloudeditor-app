const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const UploadFile = require("../../core/components/UploadFile/UploadFile");

const ACCEPTED_FILES = "image/*";
const TYPE = "image";

require("./AddImage.css");
const Gallery = require("../../core/components/Gallery/Gallery");

class AddImage extends React.Component {
  render() {
    return (
      <div className="uploadContainer">
        <UploadFile acceptedFiles={ACCEPTED_FILES} type={TYPE} />
        <Gallery
          type={TYPE}
          deleteImage={this.deleteImageHandler}
          selectImage={this.selectImageHandler}
        />
      </div>
    );
  }
}

AddImage.defaultProps = {
  id: "addImage-wrapper"
};

const AddImagePlugin = connect(
  null,
  null
)(withNamespaces("addImage")(AddImage));

module.exports = {
  AddImage: assign(AddImagePlugin, {
    disablePluginIf:
      "{store().getState().project.title==='Empty Project!!@!!@!@'}",
    SideBar: {
      position: 3,
      priority: 1,
      text: "Add Image",
      icon: "fupa-foto",
      showMore: true,
      tooltip: { title: "Add Image", description: "Add a new image block" }
    }
  })
};
