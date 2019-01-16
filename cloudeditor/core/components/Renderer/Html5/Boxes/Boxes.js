const React = require("react");

const Box = require("./Box");
const boxes = props => {
  const { boxes, width, height, inlineClass } = props;
  const renderBox = Object.keys(boxes).map(obKey => {
    if (obKey === "bleed") {
      return null;
    }
    return (
      <Box
        type={obKey}
        key={obKey}
        {...boxes[obKey]}
        width={width}
        height={height}
        borderWidth={1}
        inlineClass={inlineClass}
      />
    );
  });

  return <React.Fragment>{renderBox}</React.Fragment>;
};

module.exports = boxes;
