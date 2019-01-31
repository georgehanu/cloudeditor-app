const React = require("react");

const galleryToolbarPreview = props => {
  const className = "uploadGalleryItem ";

  return (
    <div className={className}>
      <img
        src={props.image.thumbnail_src}
        alt="galleryItem"
        className="uploadGalleryItemImage"
      />
      <div className="galleryItemActions">
        <span
          className="select icon printqicon-ok"
          onClick={() => props.selectAsset(props.image)}
        />

        <span
          className="delete icon printqicon-delete"
          onClick={() => props.deleteAsset(props.image.id)}
        />
      </div>
    </div>
  );
};
module.exports = galleryToolbarPreview;
