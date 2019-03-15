const React = require("react");
const Line = require("./Line");
require("./Box.css");
const { connect } = require("react-redux");
const {
  allowMagneticSelector
} = require("../../../../../core/stores/selectors/project");
const box = props => {
  const {
    top,
    bottom,
    left,
    right,
    width,
    height,
    borderWidth,
    type,
    inlineClass
  } = props;
  if (
    (type === "magneticSnap" || type === "magneticSnapEdge") &&
    !props.useMagentic
  ) {
    return null;
  }
  const classes = [type, "boxLine", inlineClass].join(" ");
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
    left: type === "magneticSnap" ? Math.floor(width - right) : width - right
  };
  const bottomStyle = {
    top:
      type === "magneticSnap" ? Math.floor(height - bottom) : height - bottom,
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
const mapStateToProps = state => {
  return { useMagentic: allowMagneticSelector(state) };
};
module.exports = connect(
  mapStateToProps,
  null
)(box);
