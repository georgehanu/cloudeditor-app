const React = require("react");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const { DropTarget } = require("react-dnd");
const Cropper = require("react-cropper").default;
require("cropperjs/dist/cropper.css");
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
class ImageBlock extends React.Component {
  _crop() {}
  setData = () => {
    const canvasData = this.refs.cropper.getCanvasData();
    const containerData = this.refs.cropper.getCanvasData();
    const data = this.refs.cropper.getData();
    const { width, height } = this.props;
    const imageWidth = canvasData.naturalWidth;
    const imageHeight = canvasData.naturalHeight;

    let widthRatio = 1;
    let heightRatio = 1;
    let minPercent = 1;
    if (imageWidth > 0) {
      widthRatio = width / imageWidth;
      heightRatio = height / imageHeight;
      if (widthRatio <= heightRatio) {
        minPercent = heightRatio;
      } else {
        minPercent = widthRatio;
      }
    }
    const widthImage = Math.ceil(imageWidth * 2 * minPercent);
    const heightImage = Math.ceil(imageHeight * minPercent);
    //this.refs.cropper.setAspectRatio(minPercent);
    this.refs.cropper.setCanvasData({
      ...canvasData,
      width: widthImage,
      height: null,
      left: 0,
      top: 0
    });

    this.refs.cropper.setCropBoxData({
      ...canvasData,
      width,
      height,
      left: 0,
      top: 0
    });
  };
  componentDidMount() {}
  componentDidUpdate() {
    this.setData();
  }
  render() {
    const {
      imageWidth,
      imageHeight,
      key,
      width,
      height,
      top,
      left,
      ...otherProps
    } = this.props;
    const style = {
      width: width,
      height: height,
      left: left,
      top: top
    };
    let widthRatio = 1;
    let heightRatio = 1;
    let minPercent = 1;
    if (imageWidth > 0) {
      widthRatio = width / imageWidth;
      heightRatio = height / imageHeight;
      if (widthRatio <= heightRatio) {
        minPercent = heightRatio;
      } else {
        minPercent = widthRatio;
      }
    }
    const widthImage = Math.ceil(imageWidth * minPercent);
    const heightImage = Math.ceil(imageHeight * minPercent);
    return (
      <Cropper
        ref="cropper"
        src={this.props.image_src}
        style={{ height: heightImage, width: widthImage }}
        // Cropper.js options
        guides={false}
        dragMode={"move"}
        viewMode={1}
        rotatable={false}
        cropBoxMovable={false}
        restore={false}
        ready={this.setData.bind(this)}
      />
    );
  }
}

module.exports = hot(module)(
  connect(
    null,
    null
  )(ImageBlock)
);
