const React = require("react");
const Backdrop = require("../UI/Backdrop");
const MenuHeader = require("../UI/MenuModalItems/MenuHeader");
const Cropper = require("react-cropper").default;
require("cropperjs/dist/cropper.css");
const WithSliderDim = require("../SliderCarousel/renderProps/withSliderDim");

class CropImageModal extends React.Component {
  cropX = null;
  cropY = null;
  cropW = null;
  cropH = null;
  zoomCropValue = null;
  cropRef = React.createRef();
  state = {
    setCropData: false
  };
  scale = 1;
  croppedChanged = false;
  containerHeight = null;
  containerWidth = null;

  onCropImageHandler = () => {
    if (this.croppedChanged) {
      this.props.onCropImageHandler({
        cropX: this.cropX,
        cropY: this.cropY,
        cropW: this.cropW,
        cropH: this.cropH,
        zoomCropValue: this.zoomCropValue
      });
    } else {
      this.props.modalClosed();
    }
  };

  onZoomHandler = obj => {
    this.zoomCropValue = obj.detail.ratio;
  };

  componentDidMount = () => {};

  setZoom = props => {
    /*const ratio = 1; //+ props.leftSlider / 100;
    const canvasData = this.cropRef.current.getCanvasData();
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
    this.cropRef.current.zoomTo((widthImage * ratio) / imageWidth);*/
  };

  onCrop = obj => {
    if (this.state.setCropData === false) {
      // first time
      const imageData = this.cropRef.current.getImageData();

      this.setState({ setCropData: true });

      const containerAR = this.containerWidth / this.containerHeight;
      const imageAR = imageData.naturalWidth / imageData.naturalHeight;
      let scale = 1;
      let newWidth = null;
      let newHeight = null;

      //if (imageRatio < containerRatio) {
      /*if (imageAR < containerAR) {
        scale = imageData.naturalHeight / this.containerHeight;
        newWidth = imageData.naturalWidth / scale;
        newHeight = this.containerHeight;
      } else {
        scale = imageData.naturalWidth / this.containerWidth;
        newWidth = this.containerWidth;
        newHeight = imageData.naturalHeight / scale;
      }*/

      this.cropRef.current.setCropBoxData({
        left: 0,
        top: 0,
        height: this.containerHeight
        // width: newWidth
      });
      const dataNew = this.cropRef.current.getData();
      const imageDataNew = this.cropRef.current.getImageData();

      this.cropX = Math.floor(dataNew.x);
      this.cropY = Math.floor(dataNew.y);
      this.cropW = Math.round(imageDataNew.width);
      this.cropH = Math.round(imageDataNew.height);
      this.zoomCropValue = this.props.image.zoomCropValue;

      return;
    }

    this.croppedChanged = true;

    this.cropX = obj.detail.x;
    this.cropY = obj.detail.y;
    this.cropW = obj.detail.width;
    this.cropH = obj.detail.height;
  };

  onCropZoomIn = () => {
    this.cropRef.current.zoom(0.1);
  };

  onCropZoomOut = () => {
    this.cropRef.current.zoom(-0.1);
  };
  render() {
    return (
      <React.Fragment>
        <Backdrop show={true} clicked={this.props.modalClosed} />
        <div className="cropImageModal">
          <MenuHeader
            modalClosed={this.props.modalClosed}
            title="Crop Image"
            className="MenuHeader ImageCropMenuHeader"
          />

          <div className="cropModalOuterContainer">
            <WithSliderDim
              active={true}
              containerClass="MenuDataModalContainer cropModalContainer"
            >
              {dim => {
                if (dim.width === null) return null;
                const dimHeight = dim.height - 50;
                const mainImage = this.props.image;
                const containerRatio = dim.width / dimHeight; //parent
                const imageRatio = mainImage.width / mainImage.height; //current

                let css = {
                  width: 0,
                  height: 0
                };
                let scale = 1;

                if (imageRatio < containerRatio) {
                  scale = mainImage.height / dimHeight;
                  css = {
                    ...css,
                    width: mainImage.width / scale,
                    height: dimHeight
                    /*width: dim.width,
                    height: dimHeight * scale*/
                  };
                } else {
                  scale = mainImage.width / dim.width;
                  css = {
                    ...css,
                    width: dim.width,
                    height: mainImage.height / scale
                  };
                }

                this.scale = scale;

                const aspectRatioW = mainImage.width;
                const aspectRatioH = mainImage.height;

                css.height = dimHeight * 4; //(aspectRatioH / aspectRatioW);
                css.width = dim.width;

                this.containerHeight = dimHeight;
                this.containerWidth = dim.width;

                return (
                  <React.Fragment>
                    <Cropper
                      ref={this.cropRef}
                      src={this.props.image.src}
                      style={{
                        height: css.height,
                        width: css.width
                      }}
                      // Cropper.js options
                      //  aspectRatio={aspectRatioW / aspectRatioH}
                      guides={false}
                      dragMode="move"
                      cropBoxResizable={false}
                      cropBoxMovable={false}
                      minContainerWidth={20}
                      // minCropBoxHeight={5000}
                      //minCropBoxWidth={5000}
                      crop={this.onCrop}
                      viewMode={1}
                      //background={false}
                      center={false}
                      zoom={this.onZoomHandler}
                      build={() => {
                        console.log("build");
                      }}
                      // ready={this.onReadyCropper}

                      /*cropBoxData={{
                        left: 0,
                        top: 0,
                        height: 200
                        //width: 500
                      }}*/
                    />
                  </React.Fragment>
                );
              }}
            </WithSliderDim>
          </div>
          <div className="cropImageApplyContainer">
            <div className="zoomButtons">
              <button onClick={this.onCropZoomIn}>+</button>
              <button onClick={this.onCropZoomOut}>-</button>
            </div>
            <div className="confirmButtons">
              <button onClick={this.onCropImageHandler}>Ok</button>
              <button onClick={this.props.modalClosed}>Cancel</button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

module.exports = CropImageModal;
