const React = require("react");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const { DragSource } = require("react-dnd");
const uuidv4 = require("uuid/v4");
const type = "image";

const GalleryDragLayer = require("./GalleryDragLayer");
const { getEmptyImage } = require("react-dnd-html5-backend");

const PageSource = {
  beginDrag(props) {
    props.addContainerClasses("GalleryItem", ["containerMaxZindex"]);
    return {
      id: uuidv4(),
      type: props.type,
      subType: props.type,
      image_src: props.image_src,
      image_path: props.image_path,
      imageWidth: props.imageWidth,
      imageHeight: props.imageHeight
    };
  },
  canDrag(props, monitor) {
    return true;
  },
  endDrag(props) {
    props.addContainerClasses("GalleryItem", []);
  }
};

collectDrag = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
};
class galleryItem extends React.Component {
  componentDidMount() {
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    if (this.props.connectDragPreview) {
      this.props.connectDragPreview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true
      });
    }
  }

  render() {
    const className =
      "uploadGalleryItem " +
      (this.props.selectedId === this.props.id
        ? "uploadGalleryItemSelected"
        : "");

    return (
      <div
        className={className}
        style={{ backgroundImage: 'url("' + this.props.thumbnail_src + '")' }}
      >
        {this.props.connectDragPreview(
          <div>
            <GalleryDragLayer />
          </div>
        )}
        <div className="galleryItemActions">
          {this.props.connectDragSource(
            <span className="select icon printqicon-ok" />
          )}
          <span
            className="delete icon printqicon-delete"
            onClick={() => this.props.deleteAsset(this.props.id)}
          />
        </div>
      </div>
    );
  }
}
module.exports = hot(module)(
  connect(null)(
    DragSource(
      props => {
        return props.type;
      },
      PageSource,
      collectDrag
    )(galleryItem)
  )
);
