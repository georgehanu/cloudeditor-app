const React = require("react");

require("./Box.css");
const box = props => {
  const { top, bottom, left, right, width, height, borderWidth } = props;
  const classes = [props.type, "boxLine"].join(" ");
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
      <div style={topStyle} className={classes + " top"} />
      <div style={leftStyle} className={classes + " left"} />
      <div style={rightStyle} className={classes + " right"} />
      <div style={bottomStyle} className={classes + " bottom"} />
    </React.Fragment>
  );
};

module.exports = box;
