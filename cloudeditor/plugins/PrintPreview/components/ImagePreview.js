const React = require("react");
const withSpinner = require("../../../core/hoc/withSpinner/withSpinner");
const Magnifier = require("react-magnifier").default;

const imagePreview = props => {
  return (
    <div
      className="previewImagecontainer"
      onMouseEnter={props.onMouseEnterHandler}
      onMouseLeave={props.onMouseLeaveHandler}
    >
      {props.imgSrc && (
        <Magnifier
          src={props.imgSrc}
          mgWidth={300}
          mgHeight={300}
          mgBorderWidth={10}
          zoomFactor={0.5}
        />
      )}
    </div>
  );
};

module.exports = withSpinner(imagePreview);
