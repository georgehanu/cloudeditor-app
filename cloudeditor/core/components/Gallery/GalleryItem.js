const React = require("react");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const { DragSource } = require("react-dnd");
const type = "image";
const PageSource = {
  beginDrag(props) {
    return {
      type,
      image_src: props.image_src,
      imagePath: props.image_path,
      imageWidth: props.imageWidth,
      imageHeight: props.imageHeight
    };
  },
  canDrag(props, monitor) {
    return true;
  }
};

collectDrag = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};
const galleryItem = props => {
  const className =
    "uploadGalleryItem " +
    (props.selectedId === props.id ? "uploadGalleryItemSelected" : "");

  return props.connectDragSource(
    <div className={className}>
      <img
        src={props.thumbnail_src}
        alt="galleryItem"
        className="uploadGalleryItemImage"
        onClick={() => props.selectImage(props.id)}
      />
      <div className="galleryItemActions">
        <span
          className="select icon printqicon-ok"
          onClick={() => props.selectImage(props.id)}
        />
        <span
          className="delete icon printqicon-delete"
          onClick={() => props.deleteAsset({ id: props.id })}
        />
      </div>
    </div>
  );
};
module.exports = hot(module)(
  connect(null)(DragSource(type, PageSource, collectDrag)(galleryItem))
);
