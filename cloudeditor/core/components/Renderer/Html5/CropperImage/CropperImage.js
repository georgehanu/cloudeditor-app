const React = require("react");
const { merge } = require("ramda");
const $ = require("jquery");
const { equals } = require("ramda");
require("./CropperImage.css");
class CropperImage extends React.Component {
  constructor(props) {
    super(props);
    this.el = React.createRef();
    this.wrapper = React.createRef();
    this.options = {
      leftImage: 0,
      topImage: 0,
      widthImage: 0,
      minPercent: 0,
      focalPoint: {
        x: 0,
        y: 0
      },
      dragImageCoords: {},
      isDragging: false,
      resizeTimes: 2,
      dragMouseCoords: {},
      workingPercent: 1,
      componentReady: 0,
      originalWidth: 0,
      originalHeight: 0,
      zoomScale: 0,
      resizing: 0
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (equals(nextProps, this.props)) return false;
    return true;
  }
  componentDidMount() {
    if (!this.props.viewOnly) {
      document.addEventListener("mousemove", this.handleMouseMove.bind(this));
      document.addEventListener("mouseup", this.handleMouseUp.bind(this));
    }
  }

  componentDidUpdate = () => {
    if (
      this.props.viewOnly ||
      this.props.zoomScale != this.options.zoomScale ||
      this.props.resizing
    ) {
      this.options = merge(
        { ...this.options },
        { zoomScale: this.props.zoomScale, resizing: this.props.resizing }
      );
      this.initializeDimensions();
    }

    this.setZoom();
  };
  fillContainer = (val, targetLength, containerLength, alternate_zoom) => {
    if (alternate_zoom) {
      if (val > containerLength) val = containerLength - 5;
      if (val + targetLength < 0) val = -targetLength + 5;
    } else {
      if (val + targetLength < containerLength)
        val = containerLength - targetLength;
      if (val > 0) val = 0;
    }
    return val;
  };
  initializeDimensions = () => {
    let { workingPercent, minPercent, focalPoint, resizeTimes } = this.options;
    const { alternateZoom, leftSlider, cropX, cropY, cropW } = this.props;
    const targetWidth = this.props.width;
    const targetHeight = this.props.height;
    let widthRatio = 1;
    let heightRatio = 1;
    const originalWidth = 684;
    const originalHeight = 350;
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
    if (!cropW) {
      workingPercent = minPercent;
      focalPoint = {
        x: Math.round(originalWidth / 2),
        y: Math.round(originalHeight / 2)
      };
    } else {
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
        originalWidth,
        originalHeight
      }
    );
  };

  focusOnCenter = () => {
    const {
      workingPercent,
      originalWidth,
      originalHeight,
      focalPoint
    } = this.options;
    const { alternateZoom } = this.props;
    const targetWidth = this.props.width;
    const targetHeight = this.props.height;
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
    this.storeFocalPoint();
    this.updateResult();
  };

  updateResult = () => {
    if (this.props.viewOnly || this.props.resizing) {
      return false;
    }
    const image = this.el.current;
    const { workingPercent, leftImage, topImage } = this.options;
    const targetWidth = this.props.width;
    const targetHeight = this.props.height;
    let result = {};
    if (image) {
      result = {
        cropX: Math.floor((parseInt(leftImage) / workingPercent) * -1),
        cropY: Math.floor((parseInt(topImage) / workingPercent) * -1),
        cropW: Math.round(targetWidth / workingPercent),
        cropH: Math.round(targetHeight / workingPercent),
        workingPercent
      };
      this.props.onUpdateProps({
        id: this.props.id,
        props: result
      });
    }
    // here we have to update the big state
    // base.options.onChange.call(base.image, base.result);
  };
  handleMouseDown = event => {
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
  };

  handleMouseMove = event => {
    const { isDragging, dragImageCoords, dragMouseCoords } = this.options;
    const { active, alternateZoom } = this.props;
    const targetWidth = this.props.width;
    const targetHeight = this.props.height;
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
      this.storeFocalPoint();
      this.updateResult();
    }
  };
  handleMouseUp = () => {
    const isDragging = false;
    this.options = merge({ ...this.options }, { isDragging });
    //this.updateResult();
  };
  setZoom = () => {
    let {
      originalWidth,
      workingPercent,
      resizeTimes,
      minPercent
    } = this.options;
    const { leftSlider } = this.props;
    const resizeUnit = parseFloat(resizeTimes * minPercent) / 100;
    workingPercent = minPercent + resizeUnit * leftSlider;
    const widthImage = Math.ceil(originalWidth * workingPercent);
    this.options = merge({ ...this.options }, { widthImage, workingPercent });
    this.focusOnCenter();
  };
  storeFocalPoint = () => {
    const { workingPercent, leftImage, topImage } = this.options;
    const targetWidth = this.props.width;
    const targetHeight = this.props.height;
    const focalPoint = {
      x: (parseInt(leftImage) * -1 + targetWidth / 2) / workingPercent,
      y: (parseInt(topImage) * -1 + targetHeight / 2) / workingPercent
    };
    this.options = merge({ ...this.options }, { focalPoint });
  };
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
    const { leftImage, topImage, widthImage } = this.options;
    const filterStyle = {
      filter: filterString,
      transform: flipStyle,
      left: leftImage,
      top: topImage,
      width: widthImage
    };

    return (
      <div ref={this.wrapper} className="jwc_frame" style={styleWrapper}>
        <img
          onLoad={() => {
            this.options = merge(
              { ...this.options },
              { zoomScale: this.props.zoomScale, resizing: this.props.resizing }
            );
            this.initializeDimensions();
            this.setZoom();
          }}
          onMouseDown={e => this.handleMouseDown(e)}
          src={this.props.image_src}
          ref={this.el}
          style={filterStyle}
        />
      </div>
    );
  }
}
module.exports = CropperImage;
