const React = require("react");

const Group = require("../Group/Group");

const Utils = require("../../ToolbarConfig/utils");

const ToolbarArea = props => {
  const className = Utils.MergeClassName("ToolbarArea", props.className);
  const groups = props.groups.map((item, idx) => {
    return (
      <Group
        key={idx}
        items={item.items}
        className={item.className}
        ToolbarHandler={props.ToolbarHandler}
      />
    );
  });

  return <div className={className}>{groups}</div>;
};

module.exports = ToolbarArea;
