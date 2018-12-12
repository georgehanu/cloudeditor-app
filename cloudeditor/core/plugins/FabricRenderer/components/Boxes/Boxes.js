const React = require("react");

const Box = require("./Box");
const boxes = props => {
  const { boxes, width, height, offsetX, offsetY, scale } = props;
  const renderBox = Object.keys(boxes).map(obKey => {
    return (
      <Box
        type={obKey}
        key={obKey}
        {...boxes[obKey]}
        width={width}
        height={height}
        offsetX={offsetX}
        offsetY={offsetY}
        borderWidth={1 * scale}
      />
    );
  });

  return <React.Fragment>{renderBox}</React.Fragment>;
};

module.exports = boxes;
