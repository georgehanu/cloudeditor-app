const React = require("react");
const { merge } = require("ramda");
class CropperImage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.el = React.createRef();
    this.wrapper = React.createRef();
    this.options = {
      leftImage: 0,
      topImage: 0,
      minPercent: 0,
      focalPoint: {
        x: 0,
        y: 0
      },
      initialRestore: false,
      dragImageCoords: {},
      isDragging: false,
      resizeTimes: 2,
      dragMouseCoords: {},
      workingPercent: ""
    };
  }

  updateImage() {
    const { leftImage, topImage, widthImage } = this.options;
    const { parent } = this.props;
    const imageStyle = {
      position: "absolute",
      top: topImage,
      left: leftImage,
      width: widthImage
    };
    const targetWidth = parent.offsetWidth;
    const targetHeight = parent.offsetHeight;
    const styleWrapper = {
      overflow: "hidden",
      position: "relative",
      width: targetWidth,
      height: targetHeight
    };
    const image = this.el.current;
    const wrapper = this.wrapper.current;
    $(image).css(imageStyle);
    $(wrapper).css(styleWrapper);
  }
  componentDidUpdate() {
    this.initializeDimensions(false);
  }
  componentDidMount() {
    if (!this.props.viewOnly) {
      document.addEventListener("mousemove", this.handleMouseMove.bind(this));
      document.addEventListener("mouseup", this.handleMouseUp.bind(this));
    }
    document.addEventListener(
      "cropperUpdateMiddle",
      this.updateCropMiddle.bind(this)
    );
    document.addEventListener("cropperUpdate", this.updateCrop.bind(this));
    document.addEventListener("cropperUpdate", this.updateCrop.bind(this));
  }
  updateCropMiddle() {
    this.options = merge(this.options, { initialRestore: false });
    this.updateCrop();
  }
  updateCrop() {
    this.initializeDimensions(false);
    this.setZoom();
    this.options = merge(this.options, { initialRestore: true });
  }
  fillContainer(val, targetLength, containerLength, alternate_zoom) {
    // ensure that no gaps are between target's edges and container's edges
    if (alternate_zoom) {
      if (val > containerLength) val = containerLength - 5;
      if (val + targetLength < 0) val = -targetLength + 5;
    } else {
      if (val + targetLength < containerLength)
        val = containerLength - targetLength;
      if (val > 0) val = 0;
    }
    return val;
  }
  initializeDimensions(shouldUpdate) {
    const { initialRestore } = this.options;
    let { workingPercent, minPercent, focalPoint } = this.options;
    const { alternateZoom, parent } = this.props;
    const targetWidth = parent.offsetWidth;
    const targetHeight = parent.offsetHeight;
    let { cropX, cropY, cropH, cropW } = this.props;
    let widthRatio = 1;
    let heightRatio = 1;
    $(this.el.current).css({ width: "" });
    const originalWidth = this.el.current.offsetWidth;
    const originalHeight = this.el.current.offsetHeight;
    if (originalWidth > 0) {
      widthRatio = targetWidth / originalWidth;
      heightRatio = targetHeight / originalHeight;
      if (alternateZoom) {
        if (widthRatio >= heightRatio) {
          minPercent = heightRatio;
        } else {
          minPercent = widthRatio;
        }
      } else {
        if (widthRatio <= heightRatio) {
          minPercent = heightRatio;
        } else {
          minPercent = widthRatio;
        }
      }
    }
    if (!initialRestore || !cropW) {
      workingPercent = minPercent;
      focalPoint = {
        x: Math.round(originalWidth / 2),
        y: Math.round(originalHeight / 2)
      };
    } else {
      const { leftSlider } = this.props;
      const { resizeTimes } = this.options;
      const resizeUnit = parseFloat(resizeTimes * minPercent) / 100;
      const workingPercent_c = minPercent + resizeUnit * leftSlider;
      focalPoint = {
        x: (cropX * workingPercent_c * 1 + targetWidth / 2) / workingPercent_c,
        y: (cropY * workingPercent_c * 1 + targetHeight / 2) / workingPercent_c
      };
    }
    this.options = merge(
      { ...this.options },
      {
        minPercent,
        focalPoint,
        originalWidth,
        originalHeight,
        widthRatio,
        heightRatio,
        workingPercent,
        cropX,
        cropY,
        cropH,
        cropH
      }
    );
    this.setZoom(shouldUpdate);
  }

  focusOnCenter() {
    const {
      workingPercent,
      originalWidth,
      originalHeight,
      minPercent,
      oldWorking,
      focalPoint
    } = this.options;
    const { parent, alternateZoom } = this.props;
    const targetWidth = parent.offsetWidth;
    const targetHeight = parent.offsetHeight;
    let { cropX, cropY } = this.options;
    const width = originalWidth * workingPercent;
    const height = originalHeight * workingPercent;
    const leftImage = this.fillContainer(
      Math.round(focalPoint.x * workingPercent - targetWidth / 2) * -1,
      width,
      targetWidth,
      alternateZoom
    );
    var topImage = this.fillContainer(
      Math.round(focalPoint.y * workingPercent - targetHeight / 2) * -1,
      height,
      targetHeight,
      alternateZoom
    );
    this.options = merge({ ...this.options }, { topImage, leftImage });
    this.updateImage();
    this.storeFocalPoint();
  }

  updateResult(shouldUpdate) {
    const image = this.el.current;
    const { workingPercent, minPercent } = this.options;
    const { parent } = this.props;
    const targetWidth = parent.offsetWidth;
    const targetHeight = parent.offsetHeight;
    let result = {};
    let result2 = {};
    if (image) {
      result = {
        cropX: Math.floor((parseInt(image.style.left) / workingPercent) * -1),
        cropY: Math.floor((parseInt(image.style.top) / workingPercent) * -1),
        cropW: Math.round(targetWidth / workingPercent),
        cropH: Math.round(targetHeight / workingPercent)
      };
      result2 = {
        cropX: Math.floor(parseInt(image.style.left) / workingPercent),
        cropY: Math.floor(parseInt(image.style.top) / workingPercent),
        cropW: Math.round(targetWidth / workingPercent),
        cropH: Math.round(targetHeight / workingPercent)
      };
      this.options = merge({ ...this.options }, result2);
      if (shouldUpdate) {
        this.props.onUpdateProps({
          id: this.props.id,
          props: result
        });
      }
    }

    // here we have to update the big state
    // base.options.onChange.call(base.image, base.result);
  }
  handleMouseDown(event) {
    event.preventDefault(); //some browsers do image dragging themselves
    let { isDragging, dragMouseCoords, dragImageCoords } = this.options;
    const image = this.el.current;
    isDragging = true;
    dragMouseCoords = {
      x: event.pageX || event.originalEvent.touches[0].pageX,
      y: event.pageY || event.originalEvent.touches[0].pageY
    };
    dragImageCoords = {
      x: parseInt(image.style.left),
      y: parseInt(image.style.top)
    };
    this.options = merge(
      { ...this.options },
      { isDragging, dragImageCoords, dragMouseCoords }
    );
  }

  handleMouseMove(event) {
    const { isDragging, dragImageCoords, dragMouseCoords } = this.options;
    const { active, parent, alternateZoom } = this.props;
    const targetWidth = parent.offsetWidth;
    const targetHeight = parent.offsetHeight;
    const image = this.el.current;
    if (isDragging && active) {
      event.preventDefault();
      const xDif =
        (event.pageX || event.originalEvent.touches[0].pageX) -
        dragMouseCoords.x;
      const yDif =
        (event.pageY || event.originalEvent.touches[0].pageY) -
        dragMouseCoords.y;
      const leftImage = this.fillContainer(
        dragImageCoords.x + xDif,
        image.width,
        targetWidth,
        alternateZoom
      );
      const topImage = this.fillContainer(
        dragImageCoords.y + yDif,
        image.height,
        targetHeight,
        alternateZoom
      );
      this.options = merge({ ...this.options }, { topImage, leftImage });
      this.updateImage();
      this.storeFocalPoint();
      this.updateResult(true);
    }
  }
  handleMouseUp() {
    const isDragging = false;
    this.options = merge({ ...this.options }, { isDragging });
    this.updateResult(true);
  }
  setZoom(shouldUpdate) {
    let {
      originalWidth,
      workingPercent,
      originalHeight,
      cropX,
      cropY
    } = this.options;
    $(this.el.current).css({ width: "" });
    const { leftSlider } = this.props;
    const { resizeTimes, minPercent } = this.options;
    const resizeUnit = parseFloat(resizeTimes * minPercent) / 100;
    workingPercent = minPercent + resizeUnit * leftSlider;
    const widthImage = Math.ceil(originalWidth * workingPercent);
    this.options = merge(
      { ...this.options },
      { widthImage, workingPercent, cropX, cropY }
    );
    this.updateImage();
    this.focusOnCenter();
    this.updateResult(shouldUpdate);
  }
  storeFocalPoint() {
    const { workingPercent } = this.options;
    const { parent } = this.props;
    const image = $(this.el.current);
    const targetWidth = parent.offsetWidth;
    const targetHeight = parent.offsetHeight;
    const focalPoint = {
      x: (parseInt(image.css("left")) * -1 + targetWidth / 2) / workingPercent,
      y: (parseInt(image.css("top")) * -1 + targetHeight / 2) / workingPercent
    };
    this.options = merge(this.options, { focalPoint });
  }
  zoomIn() {
    const { minPercent, zoomSteps, workingPercent } = this.options;
    const zoomIncrement = (1.0 - minPercent) / (zoomSteps - 1);
    this.setZoom(workingPercent + zoomIncrement);
    return false;
  }
  zoomOut() {
    const { minPercent, zoomSteps, workingPercent } = this.options;
    var zoomIncrement = (1.0 - minPercent) / (zoomSteps - 1);
    this.setZoom(workingPercent - zoomIncrement);
    return false;
  }

  render() {
    const { parent } = this.props;

    const targetWidth = parent.offsetWidth;
    const targetHeight = parent.offsetHeight;
    const styleWrapper = {
      overflow: "hidden",
      position: "relative",
      width: targetWidth,
      height: targetHeight
    };
    let filterString = "";
    let flipStyle = "";
    if (this.props.filter.length) {
      filterString = this.props.filter + "(1)";
    }
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
    }
    const filterStyle = { filter: filterString, transform: flipStyle };

    return (
      <div ref={this.wrapper} className="jwc_frame" style={styleWrapper}>
        <img
          onLoad={() => {
            this.initializeDimensions();
          }}
          onMouseDown={e => this.handleMouseDown(e)}
          src={this.props.src}
          ref={this.el}
          style={filterStyle}
        />
      </div>
    );
  }
}
module.exports = CropperImage;
