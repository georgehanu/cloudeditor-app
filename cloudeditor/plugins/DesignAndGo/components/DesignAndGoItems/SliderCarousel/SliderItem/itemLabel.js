const React = require("react");

require("./itemLabel.css");

const itemLabel = props => {
  const { top, left, width, height, scale } = props;

  let css = {
    top: top / scale,
    left: left / scale,
    width: width / scale,
    height: height / scale,
    ...props.labelStyle
  };

  return <div className="itemLabel" style={css} />;
};

module.exports = itemLabel;
