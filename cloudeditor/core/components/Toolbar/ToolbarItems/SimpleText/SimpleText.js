const React = require("react");
const { withNamespaces } = require("react-i18next");
const Utils = require("../../ToolbarConfig/utils");

const simpleText = props => {
  let defaultClasses = [""];
  const className = Utils.MergeClassName(defaultClasses, props.className);
  return (
    <div className={className}>
      {props.text && <span>{props.t(props.text)}</span>}
    </div>
  );
};

module.exports = withNamespaces("translate")(simpleText);
