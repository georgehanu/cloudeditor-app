const React = require("react");
const withTooltip = require("../../hoc/withTooltip");

const SidebarButton = props => {
  console.log(props, "SidebarButton222");
  let defaultClasses = ["SidebarButton"];
  if (props.selected) {
    defaultClasses.push("SidebarButtonSelected");
  }

  const className = defaultClasses.join(" ");
  console.log(props, "SidebarButton");
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

module.exports = withTooltip(SidebarButton, "sidebar");
