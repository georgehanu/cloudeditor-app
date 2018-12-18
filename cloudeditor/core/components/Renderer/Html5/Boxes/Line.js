const React = require("react");

const line = props => {
  const { top, left, width, height, classes } = props;
  const style = {
    top,
    width,
    height,
    left
  };

  return <div style={style} className={classes} />;
};

module.exports = line;
