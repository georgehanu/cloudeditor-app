const React = require("react");
const withTooltip = require("../../hoc/withTooltip/withTooltip");

const galleryPreviewItem = props => {
  const className = "uploadGalleryItem ";
  // + (props.selectedId === props.id ? "uploadGalleryItemSelected" : "");
  return (
    <React.Fragment>
      <div
        className={className}
        {...props.tooltipData}
        onClick={() => props.selectImage(props.id)}
      >
        <div className="uploadGalleryItemTitle">{props.title}</div>
        <div className="uploadGalleryItemImageContainer">
          <img
            src={props.thumbnail_src}
            alt={props.title}
            className="uploadGalleryItemImage"
          />
        </div>
      </div>
    </React.Fragment>
  );
};

module.exports = withTooltip(galleryPreviewItem, "");
