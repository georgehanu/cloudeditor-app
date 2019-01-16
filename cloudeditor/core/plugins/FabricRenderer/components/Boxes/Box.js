const React = require("react");
const { componentFromProp } = require("recompose");

const Line = componentFromProp("component");

const box = props => {
  const {
    top,
    bottom,
    left,
    right,
    width,
    height,
    offsetX,
    offsetY,
    type,
    borderWidth
  } = props;
  let component = null;
  switch (type) {
    case "bleed":
      component = "BleedBox";
      break;
    case "trimbox":
      component = "TrimBox";
      break;
    default:
      component = null;
      break;
  }
  const topStyle = {
    top: top + offsetY,
    width: width - (left + right) - borderWidth,
    height: borderWidth,
    left: left + offsetX + borderWidth
  };

  const leftStyle = {
    top: top + offsetY,
    width: borderWidth,
    height: height - (top + bottom),
    left: left + offsetX
  };
  const rightStyle = {
    top: top + offsetY,
    width: borderWidth,
    height: height - (top + bottom),
    left: width - right + offsetX
  };
  const bottomStyle = {
    top: height - bottom + offsetY,
    width: width - (left + right) - borderWidth,
    height: borderWidth,
    left: left + offsetX + borderWidth
  };
  return (
    <React.Fragment>
      <Line component={component} {...topStyle} />
      <Line component={component} {...leftStyle} />
      <Line component={component} {...rightStyle} />
      <Line component={component} {...bottomStyle} />
    </React.Fragment>
  );
};

module.exports = box;
