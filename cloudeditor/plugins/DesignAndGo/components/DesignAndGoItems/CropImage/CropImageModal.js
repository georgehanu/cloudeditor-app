const React = require("react");
const Backdrop = require("../UI/Backdrop");
const MenuHeader = require("../UI/MenuModalItems/MenuHeader");
const Cropper = require("react-cropper").default;
require("cropperjs/dist/cropper.css");
const WithSliderDim = require("../SliderCarousel/renderProps/withSliderDim");
const CropImageBlock = require("./CropImageBlock");

class CropImageModal extends React.Component {
  state = {
    setCropData: false
  };
  croppedChanged = false;
  cropData = {};

  onCropImageHandler = () => {
    if (this.croppedChanged) {
      this.props.onCropImageHandler(this.cropData);
    } else {
      this.props.modalClosed();
    }
  };

  onCropImageBlockHandler = cropData => {
    this.croppedChanged = true;
    this.cropData = cropData;
  };

  /*
  onCropZoomIn = () => {
    this.cropRef.current.zoom(0.1);
  };

  onCropZoomOut = () => {
    this.cropRef.current.zoom(-0.1);
  };*/
  render() {
    const imageProps = {
      viewOnly: false,
      active: true,
      activeAction: true,
      editable: true,
      id: this.props.image.id,
      active: this.props.image.active,
      width: this.props.image.width,
      height: this.props.image.height,
      imageWidth: this.props.image.imageWidth,
      imageHeight: this.props.image.imageHeight,
      cropX: this.props.image.cropX,
      cropY: this.props.image.cropY,
      cropW: this.props.image.cropW,
      filter: this.props.image.filter,
      flip: this.props.image.flip,
      cropH: this.props.image.cropH,
      onUpdateProps: this.props.image.onUpdatePropsHandler,
      onUpdatePropsNoUndoRedo: this.props.image.onUpdateNoUndoRedoPropsHandler,
      image_src: this.props.image.src,
      leftSlider: this.props.image.leftSlider,
      initialRestore: this.props.image.initialRestore,
      alternateZoom: this.props.image.alternateZoom,
      resizing: this.props.image.resizing,
      zoomScale: this.props.image.zoomScale,
      workingPercent: this.props.image.workingPercent,
      brightness: this.props.image.brightness,
      renderId: this.props.image.renderId,
      deleteMissingImages: this.props.image.deleteMissingImages,
      setMissingImages: this.props.image.setMissingImages,
      missingImage: this.props.image.missingImage,
      bgColor: this.props.image.bgColor,
      subType: this.props.image.subType,
      backgroundblock: this.props.image.backgroundblock,
      contrast: this.props.image.contrast,
      opacity: this.props.image.opacity,
      activeAction: this.props.image.activeAction,
      naturalWidth: this.props.image.naturalWidth,
      naturalHeight: this.props.image.naturalHeight
    };

    return (
      <React.Fragment>
        <Backdrop show={true} clicked={this.props.modalClosed} />
        <div className="cropImageModal">
          <MenuHeader
            modalClosed={this.props.modalClosed}
            title="Crop Image"
            className="MenuHeader ImageCropMenuHeader"
          />

          <WithSliderDim
            active={true}
            containerClass="MenuDataModalContainer cropModalContainer"
          >
            {dim => {
              if (dim.width === null) return null;
              const dimHeight = dim.height - 140;
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
                };
              } else {
                scale = mainImage.width / dim.width;
                css = {
                  ...css,
                  width: dim.width,
                  height: mainImage.height / scale
                };
              }
              let containerLeft = 0;
              let containerTop = 0;
              if (dim.width > css.width) {
                containerLeft = (dim.width - css.width) / 2;
              } else {
                containerLeft = 0;
              }

              if (dimHeight > css.height) {
                containerTop = (dimHeight - css.height) / 2;
              } else {
                containerTop = 0;
              }

              imageProps.height = css.height;
              imageProps.width = css.width;

              return (
                <div
                  className="cropModalOuterContainer"
                  style={{
                    left: containerLeft,
                    height: dimHeight,
                    top: containerTop
                  }}
                >
                  <CropImageBlock
                    {...imageProps}
                    onCropImageBlockHandler={this.onCropImageBlockHandler}
                    zoomContainerStyle={{
                      //left: dim.width / 2 - (dim.width - css.width) / 2,
                      left: css.width / 2,
                      top: -containerTop
                    }}
                  />
                </div>
              );
            }}
          </WithSliderDim>

          <div className="cropImageApplyContainer">
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
