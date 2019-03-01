const React = require("react");
require("./DummyImage.css");
const ConfigUtils = require("../../../../../../core/utils/ConfigUtils");
const baseUrl =
  ConfigUtils.getConfigProp("baseUrl") + "/media/personalization/";
const DummyImage = props => {
  const {
    naturalWidth,
    naturalHeight,
    width,
    height,
    zoomScale,
    cropX,
    cropY,
    cropW,
    cropH
  } = props;
  let backgroundSize = "cover";
  let backgroundPosition = "center";
  let canvasWidth = naturalWidth;
  let canvasHeight = naturalHeight;

  let widthRatio2 = 1;
  let heightRatio2 = 1;
  let minPercent = 1;
  if (naturalWidth > 0) {
    widthRatio2 = width / naturalWidth;
    heightRatio2 = height / naturalHeight;
    if (widthRatio2 <= heightRatio2) {
      minPercent = heightRatio2;
    } else {
      minPercent = widthRatio2;
    }
  }
  const widthImage = Math.ceil(naturalWidth * minPercent);
  const heightImage = Math.ceil(naturalHeight * minPercent);
  const rW = ((naturalWidth / cropW) * naturalWidth) / naturalWidth;
  const rH = ((naturalHeight / cropH) * naturalHeight) / naturalHeight;

  canvasWidth = widthImage * Math.min(rH, rW);

  canvasHeight = heightImage * Math.min(rH, rW);
  const widthRatio = naturalWidth / canvasWidth;
  const heightRatio = naturalHeight / canvasHeight;
  result = {
    left: -1 * (cropX / Math.max(widthRatio, heightRatio)),
    top: -1 * (cropY / Math.max(widthRatio, heightRatio)),
    width: canvasWidth,
    height: canvasHeight
  };

  if (cropW) {
    backgroundSize = result.width + "px" + " " + result.height + "px";
    backgroundPosition = result.left + "px" + " " + result.top + "px";
  }
  const backgroundStyle = {
    backgroundImage: 'url("' + baseUrl + props.image_path + '")',
    backgroundSize,
    backgroundPosition
  };
  return <div className="dummyImage" style={backgroundStyle} />;
};

module.exports = DummyImage;
