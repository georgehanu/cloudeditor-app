const React = require("react");
const withTooltip = require("../../../../hoc/withTooltip/withTooltip");

const AddPagesButton = props => {
  const className = "pageHeaderTextTitleContainer ";
  //(props.active ? "" : "pageHeaderTextTitleContainerDisabled");

  return (
    <div
      className={className}
      onClick={props.showAddPages}
      {...props.tooltipData}
    >
      <span className="icon fupa-add-pages" />
      <span className="pageHeaderTextTitle">{props.t("Add pages")}</span>
    </div>
  );
};

//module.exports = withTooltip(AddPagesButton, "");
module.exports = AddPagesButton;
