const React = require("react");

const Text = props => {
  let output = null;

  output = <div className={props.class}>{props.text}</div>;

  return <React.Fragment>{output}</React.Fragment>;
};

module.exports = Text;
