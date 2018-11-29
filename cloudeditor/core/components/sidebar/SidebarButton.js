import React from "react";
import withTooltip from "../../hoc/withTooltip";

const SidebarButton = props => {
  let defaultClasses = ["SidebarButton"];
  if (props.selected) {
    defaultClasses.push("SidebarButtonSelected");
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

export default withTooltip(SidebarButton, "sidebar");
