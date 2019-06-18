const React = require("react");

const RightPanel = props => {
  const getTool = tool => {
    return tool.plugin;
  };

  const renderTools = () => {
    return props.tools.map((tool, i) => {
      const Tool = getTool(tool);
      return (
        <Tool
          addContainerClasses={tool.addContainerClasses}
          cfg={tool.cfg || {}}
          items={tool.items || []}
          key={i}
          index={i}
        />
      );
    });
  };

  return <div className="RightPanel">{renderTools()}</div>;
};

module.exports = RightPanel;
