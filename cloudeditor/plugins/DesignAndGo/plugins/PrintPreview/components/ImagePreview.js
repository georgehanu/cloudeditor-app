const React = require("react");
const withSpinner = require("../../../../../core/hoc/withSpinner/withSpinner");
const Magnifier = require("react-magnifier").default;

const imagePreview = props => {
  if (props.previewPageUrl === null) {
    return null;
  }
  return (
    <React.Fragment>
      {props.imgSrc && (
        <Magnifier
          src={props.imgSrc}
          mgWidth={300}
          mgHeight={300}
          mgBorderWidth={10}
          zoomFactor={0.5}
          height={props.height}
          width={props.width}
        />
      )}
    </React.Fragment>
  );
};

module.exports = withSpinner(imagePreview);
