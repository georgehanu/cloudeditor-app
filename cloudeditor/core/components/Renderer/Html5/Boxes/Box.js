const React = require("react");
const Line = require("./Line");
require("./Box.css");
const box = props => {
  const { top, bottom, left, right, width, height, borderWidth, type } = props;
  const classes = [type, "boxLine"].join(" ");
  const topStyle = {
    top,
    width: width - (left + right) - borderWidth,
    height: 1,
    left: left + borderWidth
  };

  const leftStyle = {
    top: top,
    width: 1,
    height: height - (top + bottom),
    left
  };
  const rightStyle = {
    top: top,
    width: 1,
    height: height - (top + bottom),
    left: width - right
  };
  const bottomStyle = {
    top: height - bottom,
    width: width - (left + right) - borderWidth,
    height: 1,
    left: left + borderWidth
  };
  return (
    <React.Fragment>
      <Line {...topStyle} classes={classes + " top"} />
      <Line {...leftStyle} classes={classes + " left"} />
      <Line {...rightStyle} classes={classes + " right"} />
      <Line {...bottomStyle} classes={classes + " bottom"} />
    </React.Fragment>
  );
};

module.exports = box;
