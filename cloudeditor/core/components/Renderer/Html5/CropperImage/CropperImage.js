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
    this.state = {
      leftImage: 0,
      topImage: 0,
      widthImage: 0,
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
      workingPercent: 1,
      componentReady: 0,
      originalWidth: 0,
      originalHeight: 0
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (equals(nextProps, this.props)) return false;
    return true;
  }
  componentDidMount() {
    if (!this.props.viewOnly) {
      //document.addEventListener("mousemove", this.handleMouseMove.bind(this));
      //document.addEventListener("mouseup", this.handleMouseUp.bind(this));
    }
    this.setState({ componentReady: 1 });
  }

  componentDidUpdate = () => {
    this.initializeDimensions(false);
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
    let {
      workingPercent,
      minPercent,
      focalPoint,
      initialRestore,
      resizeTimes
    } = this.state;
    const {
      alternateZoom,
      leftSlider,
      cropX,
      cropY,
      cropH,
      cropW
    } = this.props;
    const targetWidth = this.props.width;
    const targetHeight = this.props.height;
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
      const resizeUnit = parseFloat(resizeTimes * minPercent) / 100;
      const workingPercent_c = minPercent + resizeUnit * leftSlider;
      focalPoint = {
        x: (cropX * workingPercent_c * 1 + targetWidth / 2) / workingPercent_c,
        y: (cropY * workingPercent_c * 1 + targetHeight / 2) / workingPercent_c
      };
    }
    this.setState(
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
      },
      () => {
        this.setZoom();
      }
    );
  };

  focusOnCenter = () => {
    const {
      workingPercent,
      originalWidth,
      originalHeight,
      focalPoint
    } = this.state;
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

    this.setState({ topImage, leftImage });
    this.storeFocalPoint();
  };

  updateResult = () => {
    const image = this.el.current;
    const { workingPercent, minPercent } = this.state;
    const targetWidth = this.props.width;
    const targetHeight = this.props.height;
    let result = {};
    if (image) {
      result = {
        cropX: Math.floor((parseInt(image.style.left) / workingPercent) * -1),
        cropY: Math.floor((parseInt(image.style.top) / workingPercent) * -1),
        cropW: Math.round(targetWidth / workingPercent),
        cropH: Math.round(targetHeight / workingPercent)
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
    return false;
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
  };
  handleMouseUp = () => {
    const isDragging = false;
    this.options = merge({ ...this.options }, { isDragging });
    this.updateResult(true);
  };
  setZoom = () => {
    let {
      originalWidth,
      workingPercent,
      originalHeight,
      resizeTimes,
      minPercent
    } = this.state;
    const { leftSlider } = this.props;
    const resizeUnit = parseFloat(resizeTimes * minPercent) / 100;
    workingPercent = minPercent + resizeUnit * leftSlider;
    const widthImage = Math.ceil(originalWidth * workingPercent);
    this.setState({ widthImage, workingPercent });
    this.focusOnCenter();
    this.updateResult();
  };
  storeFocalPoint = () => {
    const { workingPercent } = this.state;
    const image = $(this.el.current);
    const targetWidth = this.props.width;
    const targetHeight = this.props.height;
    const focalPoint = {
      x: (parseInt(image.css("left")) * -1 + targetWidth / 2) / workingPercent,
      y: (parseInt(image.css("top")) * -1 + targetHeight / 2) / workingPercent
    };
    this.setState({ focalPoint });
  };
  render() {
    const componentReady = this.state.componentReady;
    if (!componentReady) return null;

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
    const { leftImage, topImage, widthImage } = this.state;
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
            this.initializeDimensions();
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
