const React = require("react");
const { DragLayer } = require("react-dnd");

function getItemStyles(props) {
  const { currentOffset } = props;
  if (!currentOffset) {
    return {
      display: "none"
    };
  }

  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform: transform,
    WebkitTransform: transform
  };
}

const layerStyles = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: 1,
  height: 1
};

const galleryDragLayer = props => {
  const isDragging = props.isDragging;
  if (!isDragging) {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(props)}>
        <div className="previewImagegalleryPreviewContainer">
          <div
            style={{ backgroundImage: 'url("' + props.item.image_src + '")' }}
            className="previewImagegalleryPreview"
          />
        </div>
      </div>
    </div>
  );
};

module.exports = DragLayer(monitor => ({
  item: monitor.getItem(),
  isDragging: monitor.isDragging(),
  currentOffset: monitor.getSourceClientOffset()
}))(galleryDragLayer);
