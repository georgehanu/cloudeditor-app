const React = require("react");

const Utils = require("../../ToolbarConfig/utils");
//const withTooltip = require("../../hoc/WithTooltip");

const Button = props => {
  let defaultClasses = ["ButtonIcon"];
  if (props.selected) {
    defaultClasses.push("ButtonSelected");
  }
  const className = Utils.MergeClassName(defaultClasses, props.className);
  return (
    <button
      type="button"
      className={className}
      onClick={props.clicked}
      {...props.tooltipData}
    >
      {props.children}
    </button>
  );
};
//module.exports = withTooltip(Button, "toolbar");
module.exports = Button;
