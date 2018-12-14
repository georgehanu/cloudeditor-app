const React = require("react");

const GalleryItem = props => {
  const className =
    "UploadGalleryItem " +
    (props.selectedId === props.id ? "UploadGalleryItemSelected" : "");

  return (
    <div className={className}>
      <img
        src={props.src}
        alt="GalleryItem"
        className="UploadGalleryItemImage"
        onClick={() => props.selectImage(props.id)}
      />
      <div className="GalleryItemActions">
        <span
          className="Select icon printqicon-ok"
          onClick={() => props.selectImage(props.id)}
        />
        <span
          className="Delete icon printqicon-delete"
          onClick={() => props.deleteImage(props.id)}
        />
      </div>
    </div>
  );
};

module.exports = GalleryItem;
