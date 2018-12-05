const React = require("react");

const Button = require("../../Button/Button");
const Utils = require("../../../ToolbarConfig/utils");

const ColorHeader = props => {
  const className = Utils.MergeClassName("ColorHeader", props.className);

  const items = props.data.map((el, index) => {
    let activeClass = el.type === props.activeTab ? "TabColorNameActive" : "";
    return (
      <Button
        key={index}
        className={Utils.MergeClassName(
          ["TabColorName", activeClass].join(" "),
          el.className
        )}
        clicked={() => props.selectTab(el.type)}
      >
        {el.tabName}
      </Button>
    );
  });

  return <div className={className}>{items}</div>;
};
module.exports = ColorHeader;
