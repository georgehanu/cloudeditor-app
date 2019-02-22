const React = require("react");

const galleryToolbarPreview = props => {
  const className = "uploadGalleryItem ";

  return (
    <div
      className={className}
      style={{ backgroundImage: 'url("' + props.image.thumbnail_src + '")' }}
    >
      <div className="galleryItemActions">
        <span
          className="select pic drag icon printqicon-ok ui-draggable-handle"
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
