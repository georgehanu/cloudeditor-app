const React = require("react");
const withTooltip = require("../../hoc/withTooltip/withTooltip");

const galleryPreviewItem = props => {
  const className = "uploadGalleryItem ";
  // + (props.selectedId === props.id ? "uploadGalleryItemSelected" : "");

  return (
    <React.Fragment>
      <div className={className} {...props.tooltipData}>
        <img
          src={props.thumbnail_src}
          alt="galleryItem"
          className="uploadGalleryItemImage"
          onClick={() => props.selectImage(props.id)}
        />
      </div>
    </React.Fragment>
  );
};

module.exports = withTooltip(galleryPreviewItem, "");
