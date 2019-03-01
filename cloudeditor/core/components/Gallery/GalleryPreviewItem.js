const React = require("react");
const withTooltip = require("../../hoc/withTooltip/withTooltip");
const ConfigUtils = require("../../../core/utils/ConfigUtils");
const baseUrl =
  ConfigUtils.getConfigProp("baseUrl") + "/media/personalization/";
const galleryPreviewItem = props => {
  const className = "uploadGalleryItem ";
  // + (props.selectedId === props.id ? "uploadGalleryItemSelected" : "");
  const noImage = props.icon === null || props.icon === "null" ? true : false;
  return (
    <React.Fragment>
      <div
        className={className}
        {...props.tooltipData}
        onClick={() => props.selectImage(props.id)}
      >
        <div className="uploadGalleryItemTitle">{props.title}</div>
        {noImage ? (
          <div className="uploadGalleryItemImageContainer">
            <div className="uploadGalleryItemImage noLayoutImg" />
          </div>
        ) : (
          <div className="uploadGalleryItemImageContainer">
            <div
              className="uploadGalleryItemImage "
              style={{
                backgroundImage: 'url("' + baseUrl + props.thumbnail_src + '")'
              }}
            />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

module.exports = withTooltip(galleryPreviewItem, "");
