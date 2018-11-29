const React = require("react");
require("./Border.css");

const border = props => {
  const style = {
    width: props.width,
    height: props.height,
    display: props.hide ? "none" : "block"
  };
  return <u style={style} />;
};

module.exports = border;
