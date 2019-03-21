const React = require("react");
const Gallery = require("../../../Gallery/Gallery");
const UploadFile = require("../../../../../core/components/UploadFile/UploadFile");
const { withNamespaces } = require("react-i18next");

const TYPE = "image";
const ACCEPTED_FILES = "image/*";

class ToolbarGalleryPreviewWnd extends React.Component {
  onSelectAsset = imageId => {
    this.props.ToolbarHandler({
      mainHandler: true,
      payloadMainHandler: {
        type: this.props.type,
        value: { ...imageId, subType: "image", leftSlider: 0 }
      }
    });
  };

  render() {
    return (
      <div className="toolbarGalleryPreviewContainer">
        <UploadFile
          acceptedFiles={ACCEPTED_FILES}
          type={TYPE}
          t={this.props.t}
        />
        <div className="toolbarGalleryPreviewContent">
          <Gallery
            type={TYPE}
            addContainerClasses={this.props.addContainerClasses}
            fromToolbar={true}
            onSelectAssetHandler={this.onSelectAsset}
          />
        </div>
      </div>
    );
  }
}

module.exports = withNamespaces("addImage")(ToolbarGalleryPreviewWnd);
