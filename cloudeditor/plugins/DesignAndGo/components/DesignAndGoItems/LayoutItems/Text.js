const React = require("react");
const { withNamespaces } = require("react-i18next");

const Text = props => {
  let output = null;

  output = <div className={props.class}>{props.t(props.text)}</div>;

  return <React.Fragment>{output}</React.Fragment>;
};

module.exports = withNamespaces("designAndGo")(Text);
