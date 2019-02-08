const React = require("react");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const { DropTarget } = require("react-dnd");
const CropperImage = require("../../CropperImage/CropperImage");
const type = ["image"];
require("./Image.css");
const ImageTarget = {
  drop(props, monitor, component) {
    if (monitor.isOver()) {
      const { id, ...otherProps } = monitor.getItem();
      props.onUpdateProps({
        id: props.id,
        props: {
          ...otherProps,
          cropW: 0,
          cropX: 0,
          cropY: 0,
          cropH: 0,
          missingImage: false
        }
      });
    }
  },
  canDrop(props, monitor) {
    if (!props.viewOnly) {
      return true;
    }
    return false;
  },
  hover(props, monitor) {}
};

collectDrop = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    clientOffset: monitor.getClientOffset()
  };
};
class ImageBlock extends React.PureComponent {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      ready: false
    };
  }
  componentDidMount() {
    this.setState({ ready: true });
  }
  componentDidUpdate = () => {
    if (this.props.viewOnly) {
      if (this.props.missingImage) {
        this.props.setMissingImages(this.props.id);
      } else {
        this.props.deleteMissingImages(this.props.id);
      }
    }
  };
  render() {
    const { key, width, height, top, left, ...otherProps } = this.props;
    const style = {
      width: width,
      height: height,
      left: left,
      top: top
    };
    let cropper = null;
    if (this.state.ready && !this.props.missingImage) {
      cropper = (
        <CropperImage
          targetWidth={this.props.width}
          targetHeight={this.props.height}
          cropH={this.props.cropH}
          cropW={this.props.cropW}
          cropX={this.props.cropX}
          cropY={this.props.cropY}
          imageWidth={this.props.imageWidth}
          imageHeight={this.props.imageHeight}
          image_src={this.props.image_src}
          leftSlider={this.props.leftSlider}
          alternateZoom={this.props.alternateZoom}
          width={this.props.width}
          height={this.props.height}
          viewOnly={this.props.viewOnly}
          id={this.props.id}
          resizing={this.props.resizing}
          active={this.props.active}
          filter={this.props.filter}
          flip={this.props.flip}
          contrast={this.props.contrast}
          brightness={this.props.brightness}
          renderId={this.props.renderId}
          workingPercent={this.props.workingPercent}
          onUpdatePropsHandler={this.props.onUpdateProps}
          bgColor={this.props.bgColor}
          subType={this.props.subType}
          backgroundblock={this.props.backgroundblock}
          onUpdateNoUndoRedoPropsHandler={this.props.onUpdatePropsNoUndoRedo}
        />
      );
    }
    return this.props.connectDropTarget(
      <div ref={this.el} className={this.props.type} style={style}>
        {cropper}
      </div>
    );
  }
}
module.exports = hot(module)(
  connect(
    null,
    null
  )(DropTarget(type, ImageTarget, collectDrop)(ImageBlock))
);
