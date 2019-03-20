const React = require("react");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const { DropTarget } = require("react-dnd");
const Cropper = require("react-cropper").default;
const { equals } = require("ramda");
require("cropperjs/dist/cropper.css");
const type = ["image"];
require("./Image.css");
const ConfigUtils = require("../../../../../../core/utils/ConfigUtils");
const baseUrl =
  ConfigUtils.getConfigProp("baseUrl") + "/media/personalization/";
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
  shouldComponentUpdate(nextProps, nextState) {
    if (equals(nextProps, this.props)) {
      return false;
    }
    /*   if (nextProps.image_path != this.props.image_path) {
      if (this.refs.cropper) {
        this.refs.cropper.enable();
        this.refs.cropper.reset();
        this.refs.cropper.replace(baseUrl + nextProps.image_path, true);
        this.refs.cropper.cropper.initContainer();
        this.initializeDimm();
      }
      return false;
    } */
    if (
      nextProps.leftSlider === -1 &&
      nextProps.leftSlider !== this.props.leftSlider &&
      nextProps.activeAction === 2
    ) {
      if (!this.refs.cropper.cropper.ready) {
        return false;
      }
      this.refs.cropper.enable();
      this.refs.cropper.reset();
      return true;
    }
    if (nextProps.activeAction) {
      if (!this.refs.cropper.cropper.ready) {
        return false;
      }
      this.setZoom(nextProps);
      if (!nextProps.active) {
        this.refs.cropper.disable();
      }
      return false;
    }
    if (
      nextProps.width / this.props.zoomScale !==
        this.props.width / this.props.zoomScale ||
      nextProps.height / this.props.zoomScale !==
        this.props.height / this.props.zoomScale
    ) {
      if (this.refs.cropper) {
        if (!this.refs.cropper.cropper.ready) {
          return false;
        }
        this.refs.cropper.enable();
        this.refs.cropper.reset();
      }
    }
    if (nextProps.currentPageId !== this.props.currentPageId) {
      if (!this.refs.cropper.cropper.ready) {
        return false;
      }
      this.refs.cropper.enable();
      this.refs.cropper.reset();
    }
    if (
      nextProps.width / this.props.zoomScale !==
        this.props.width / this.props.zoomScale ||
      nextProps.height / this.props.zoomScale !==
        this.props.height / this.props.zoomScale
    ) {
      if (this.refs.cropper) {
        this.refs.cropper.enable();
        this.refs.cropper.reset();
      }
    }
    if (!nextProps.activeAction && this.props.activeAction) {
      this.setZoom(nextProps);
      this.setDataOnState();
    }
    if (!nextProps.resizing && this.props.resizing) {
      this.setZoom(nextProps);
      this.setDataOnState();
    }

    return true;
  }
  setZoom = props => {
    if (this.refs.cropper) {
      if (!this.refs.cropper.cropper.ready) {
        return false;
      }
      const ratio = 1 + props.leftSlider / 100;
      const canvasData = this.refs.cropper.getCanvasData();
      const { width, height } = props;
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
      const widthImage = Math.ceil(imageWidth * minPercent);
      const heightImage = Math.ceil(imageHeight * minPercent);
      this.refs.cropper.zoomTo((widthImage * ratio) / imageWidth);
    }
  };
  setData = () => {
    if (this.refs.cropper) {
      if (!this.refs.cropper.cropper.ready) {
        return false;
      }
      this.refs.cropper.enable();
      this.refs.cropper.reset();
      const canvasData = this.refs.cropper.getCanvasData();
      if (canvasData && typeof canvasData !== "undefined") {
        if (Object.keys(canvasData).length) {
          this.refs.cropper.cropper.initContainer();
        }
      }
    }
    this.initializeDimm();
    this.setCropperData();
    this.setDataOnState();
    if (this.refs.cropper) this.refs.cropper.disable();
    if (this.props.active) this.refs.cropper.enable();
  };

  initializeDimm = () => {
    if (this.refs.cropper) {
      if (!this.refs.cropper.cropper.ready) {
        return false;
      }
      const cropBoxData = this.refs.cropper.getCropBoxData();
      const { width, height } = this.props;

      const data = this.refs.cropper.getCanvasData();
      const imageData = this.refs.cropper.getImageData();
      let canvasWidth = imageData.width;
      let canvasHeight = imageData.height;
      let widthRatio2 = 1;
      let heightRatio2 = 1;
      let minPercent = 1;
      const imageWidth = imageData.naturalWidth;
      const imageHeight = imageData.naturalHeight;
      if (imageWidth > 0) {
        widthRatio2 = width / imageWidth;
        heightRatio2 = height / imageHeight;
        if (widthRatio2 <= heightRatio2) {
          minPercent = heightRatio2;
        } else {
          minPercent = widthRatio2;
        }
      }
      const widthImage = Math.ceil(imageWidth * minPercent);
      const heightImage = Math.ceil(imageHeight * minPercent);
      const rW = imageData.naturalWidth / imageData.naturalWidth;
      const rH = imageData.naturalHeight / imageData.naturalHeight;

      canvasWidth = widthImage * Math.min(rH, rW);

      canvasHeight = heightImage * Math.min(rH, rW);

      this.refs.cropper.setCanvasData({
        ...data,
        left: Math.round((-1 * (canvasWidth - width)) / 2),
        top: Math.round((-1 * (canvasHeight - height)) / 2),
        width: canvasWidth,
        height: canvasHeight
      });

      ////

      this.refs.cropper.setCropBoxData({
        ...cropBoxData,
        width,
        height,
        left: 0,
        top: 0
      });
    }
  };
  componentDidUpdate() {
    if (this.refs.cropper) {
      if (!this.refs.cropper.cropper.ready) {
        return false;
      }
      var cropData = this.refs.cropper.getCropBoxData();
      if (
        cropData.width != this.props.width ||
        cropData.height != this.props.height
      ) {
        this.refs.cropper.enable();
        this.refs.cropper.reset();
        const canvasData = this.refs.cropper.getCanvasData();
        if (canvasData && typeof canvasData !== "undefined") {
          if (Object.keys(canvasData).length) {
            this.refs.cropper.cropper.initContainer();
          }
        }
        this.initializeDimm();
      }
      if (this.props.resizing) {
        const canvasData = this.refs.cropper.getCanvasData();
        if (canvasData && typeof canvasData !== "undefined") {
          if (Object.keys(canvasData).length) {
            this.refs.cropper.cropper.initContainer();
            this.refs.cropper.cropper.initCanvas();
          }
        }

        this.setZoom(this.props);
        return false;
      }
      // if (!this.props.cropW) this.initializeDimm();
      this.setCropperData();
      if (this.props.active) {
        this.refs.cropper.enable();
      } else {
        this.refs.cropper.disable();
      }
    }
    if (this.props.active) {
      if (this.refs.cropper) this.refs.cropper.enable();
    }
  }
  cropEndHandler = () => {
    if (!this.props.viewOnly) {
      if (!this.props.activeAction || this.props.activeAction === 2)
        this.setDataOnState();
    }
  };
  setDataOnState = () => {
    if (this.refs.cropper) {
      const data = this.refs.cropper.getData();
      const imageData = this.refs.cropper.getImageData();
      const result = {
        cropX: Math.round(data.x),
        cropY: Math.round(data.y),
        cropW: data.width,
        cropH: data.height,
        naturalWidth: imageData.naturalWidth,
        naturalHeight: imageData.naturalHeight
      };
      this.props.onUpdateProps({
        id: this.props.id,
        props: result
      });
    }
  };
  setCropperData = () => {
    const {
      cropX,
      cropY,
      cropW,
      cropH,
      zoomScale,
      width,
      height,
      leftSlider
    } = this.props;
    if (this.refs.cropper) {
      if (cropW) {
        this.setZoom(this.props);
        const data = this.refs.cropper.getCanvasData();
        const imageData = this.refs.cropper.getImageData();
        let canvasWidth = imageData.width;
        let canvasHeight = imageData.height;
        if (this.props.leftSlider) {
          canvasWidth = (imageData.naturalWidth * leftSlider) / 100;
          canvasHeight = (imageData.naturalHeight * leftSlider) / 100;
        }
        let widthRatio2 = 1;
        let heightRatio2 = 1;
        let minPercent = 1;
        const imageWidth = imageData.naturalWidth;
        const imageHeight = imageData.naturalHeight;
        if (imageWidth > 0) {
          widthRatio2 = width / imageWidth;
          heightRatio2 = height / imageHeight;
          if (widthRatio2 <= heightRatio2) {
            minPercent = heightRatio2;
          } else {
            minPercent = widthRatio2;
          }
        }
        const widthImage = Math.ceil(imageWidth * minPercent);
        const heightImage = Math.ceil(imageHeight * minPercent);
        const rW =
          ((imageData.naturalWidth / cropW) * imageData.naturalWidth) /
          imageData.naturalWidth;
        const rH =
          ((imageData.naturalHeight / cropH) * imageData.naturalHeight) /
          imageData.naturalHeight;

        canvasWidth = widthImage * Math.min(rH, rW);

        canvasHeight = heightImage * Math.min(rH, rW);
        const widthRatio = imageData.naturalWidth / canvasWidth;
        const heightRatio = imageData.naturalHeight / canvasHeight;
        const dataData = this.refs.cropper.getData();

        this.refs.cropper.setCanvasData({
          ...data,
          left: -1 * (cropX / Math.max(widthRatio, heightRatio)),
          top: -1 * (cropY / Math.max(widthRatio, heightRatio)),
          width: canvasWidth,
          height: canvasHeight
        });

        // this.refs.cropper.zoomTo(this.props.leftSlider / 100);
      }
    }
  };
  render() {
    if (!this.props.image_src) {
      return null;
    }
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
    let filterString = "";
    let flipStyle = "";
    const decBrightness = parseFloat(this.props.brightness) / 100 + 1;
    const decContrast = parseFloat(this.props.contrast) / 100 + 1;
    if (this.props.filter.length) {
      filterString = this.props.filter + "(1)";
    }
    filterString +=
      " brightness(" + decBrightness + ") contrast(" + decContrast + ") ";

    switch (this.props.flip) {
      case "flip_horizontal":
        flipStyle = "scaleX(-1)";
        break;
      case "flip_vertical":
        flipStyle = "scaleY(-1)";
        break;
      case "flip_both":
        flipStyle = "scale(-1)";
        break;
      default:
        break;
    }
    const filterStyle = {
      filter: filterString,
      transform: flipStyle
    };

    return (
      <Cropper
        ref="cropper"
        src={baseUrl + this.props.image_src}
        style={{ width: widthImage, height: heightImage, ...filterStyle }}
        // Cropper.js options
        guides={false}
        responsive={true}
        dragMode={"move"}
        viewMode={1}
        resizable={false}
        cropBoxResizable={false}
        cropBoxMovable={false}
        restore={false}
        minContainerWidth={1}
        minContainerHeight={1}
        ready={this.setData.bind(this)}
        cropend={this.cropEndHandler}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  const getCurrentPage = (state, props) => {
    return state.project.activePage;
  };

  return {
    currentPageId: getCurrentPage(state)
  };
};

module.exports = hot(module)(
  connect(
    mapStateToProps,
    null
  )(ImageBlock)
);
