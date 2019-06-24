const React = require("react");
const withSpinner = require("../../../../../core/hoc/withSpinner/withSpinner");
const Magnifier = require("react-magnifier").default;
const { useState, useEffect } = require("react");

const imagePreview = props => {
  const [imgDims, setimgDims] = useState({ width: 0, height: 0 });

  if (props.previewPageUrl === null) {
    return null;
  }

  let finalWidth = "auto";
  let finalHeight = props.height;

  if (!imgDims.width || !imgDims.height) {
    const img = new Image();
    img.onload = () => {
      setimgDims({ width: img.width, height: img.height });
    };

    img.src = props.previewPageUrl;
  } else {
    const imgRatio = imgDims.height / imgDims.width;
    const containerRatio = props.height / props.width;

    if (containerRatio < imgRatio) {
      finalHeight = props.height;
      finalWidth = props.height / imgRatio;
    } else {
      finalWidth = props.width;
      finalHeight = props.width * imgRatio;
    }
  }

  console.log("image ", imgDims);

  return (
    <React.Fragment>
      {props.imgSrc && (
        <Magnifier
          src={props.imgSrc}
          mgWidth={300}
          mgHeight={300}
          mgBorderWidth={10}
          zoomFactor={0.5}
          width={finalWidth}
          height={finalHeight}
        />
      )}
    </React.Fragment>
  );
};

module.exports = withSpinner(imagePreview);
