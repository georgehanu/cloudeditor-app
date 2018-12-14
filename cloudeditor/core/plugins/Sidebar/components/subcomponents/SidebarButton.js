const React = require("react");
const withTooltip = require("../../../../hoc/withTooltip/withTooltip");

const sidebarButton = props => {
  let defaultClasses = ["sidebarButton"];
  if (props.selected) {
    defaultClasses.push("sidebarButtonSelected");
  }

  const className = defaultClasses.join(" ");
  return (
    <button
      type="button"
      onClick={props.clicked}
      className={className}
      {...props.tooltipData}
    >
      {props.children}
    </button>
  );
};

module.exports = withTooltip(sidebarButton, "sidebar");
