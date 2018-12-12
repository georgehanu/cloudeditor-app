const React = require("react");
const withTooltip = require("../../hoc/withTooltip");

const GalleryPreviewItem = props => {
  const className =
    "UploadGalleryItem " +
    (props.selectedId === props.id ? "UploadGalleryItemSelected" : "");

  return (
    <React.Fragment>
      <div className={className} {...props.tooltipData}>
        <img
          src={props.src}
          alt="GalleryItem"
          className="UploadGalleryItemImage"
          onClick={() => props.selectImage(props.id)}
        />
      </div>
    </React.Fragment>
  );
};

module.exports = withTooltip(GalleryPreviewItem, "");
//module.exports = GalleryPreviewItem;
