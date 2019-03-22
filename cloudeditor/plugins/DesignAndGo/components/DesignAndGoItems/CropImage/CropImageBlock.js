const React = require("react");
const Cropper = require("react-cropper").default;
require("cropperjs/dist/cropper.css");
const { equals } = require("ramda");
const type = ["image"];
const $ = require("jquery");

//let zoomContainer = { left: 100, height: 40 };
let zoomContainer = { left: 0, height: 0 };

class CropImageBlock extends React.Component {
  _crop() {}
  shouldComponentUpdate(nextProps, nextState) {
    if (equals(nextProps, this.props)) {
      return false;
    }
    if (nextProps.activeAction) {
      if (!this.refs.cropper.cropper.ready) {
        return false;
      }
      this.setZoom(nextProps);
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
      this.refs.cropper.enable();
      this.refs.cropper.reset();
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
    //if (this.refs.cropper) this.refs.cropper.disable();
  };

  initializeDimm = () => {
    if (this.refs.cropper) {
      if (!this.refs.cropper.cropper.ready) {
        return false;
      }
      const canvasData = this.refs.cropper.getCanvasData();
      const cropBoxData = this.refs.cropper.getCropBoxData();
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
      const widthImage = Math.ceil(imageWidth * minPercent);
      const heightImage = Math.ceil(imageHeight * minPercent);
      this.refs.cropper.setData({
        ...data,
        width: width,
        height: height,
        left: (-1 * (widthImage - width)) / 2,
        top: (-1 * (heightImage - height)) / 2
      });
      this.refs.cropper.setCanvasData({
        ...canvasData,
        width: widthImage,
        height: null,
        left: (-1 * (widthImage - width)) / 2,
        top: (-1 * (heightImage - height)) / 2
      });
      this.refs.cropper.setCropBoxData({
        ...cropBoxData,
        width,
        height,
        left: 0,
        top: 0
      });
    }
  };
  componentDidMount = () => {
    const $el = $(this.refs.zoomButtonContainer);
    zoomContainer.left = $el.width();
    zoomContainer.height = $el.height();
    this.forceUpdate();
  };
  componentDidUpdate = () => {
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
        //this.refs.cropper.disable();
      }
    }
  };
  cropEndHandler = () => {
    if (!this.props.viewOnly) {
      if (!this.props.activeAction) this.setDataOnState();
    }
  };
  setDataOnState = () => {
    if (this.refs.cropper) {
      const data = this.refs.cropper.getData();
      const imageData = this.refs.cropper.getImageData();
      const result = {
        cropX: Math.floor(data.x),
        cropY: Math.floor(data.y),
        cropW: Math.round(data.width),
        cropH: Math.round(data.height),
        naturalWidth: imageData.naturalWidth,
        naturalHeight: imageData.naturalHeight
      };

      this.props.onCropImageBlockHandler(result);
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
      <React.Fragment>
        <div
          className="zoomButtons"
          ref="zoomButtonContainer"
          style={{
            ...this.props.zoomContainerStyle,
            left: this.props.zoomContainerStyle.left - zoomContainer.left / 2,
            top: this.props.zoomContainerStyle.top - zoomContainer.height
          }}
        >
          <button
            onClick={() => {
              this.refs.cropper.zoom(0.1);
            }}
          >
            +
          </button>
          <button
            onClick={() => {
              this.refs.cropper.zoom(-0.1);
            }}
          >
            -
          </button>
        </div>
        <Cropper
          ref="cropper"
          src={this.props.image_src}
          style={{ width: widthImage, height: heightImage }}
          // Cropper.js options
          guides={false}
          responsive={true}
          dragMode={"move"}
          viewMode={0}
          resizable={false}
          cropBoxResizable={false}
          cropBoxMovable={false}
          restore={false}
          minContainerWidth={1}
          minContainerHeight={1}
          ready={this.setData.bind(this)}
          cropend={this.cropEndHandler}
          zoom={this.cropEndHandler}
        />
      </React.Fragment>
    );
  }
}

module.exports = CropImageBlock;
