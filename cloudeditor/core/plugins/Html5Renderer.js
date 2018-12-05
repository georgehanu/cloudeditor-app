const React = require("react");
const assign = require("object-assign");
const Renderer = require("../components/Renderer/Html5");

require("./Html5Renderer/Html5Renderer.css");

class Html5Renderer extends React.Component {
  getTools = () => {
    return this.props.items.sort((a, b) => a.position - b.position);
  };
  getTool = tool => {
    return tool.plugin;
  };
  getToolConfig = tool => {
    if (tool.tool) {
      return {};
    }
    return this.props.toolCfg || {};
  };
  renderTools = () => {
    const tools = this.getTools();
    return tools.map((tool, i) => {
      const Tool = this.getTool(tool);
      const toolCfg = this.getToolConfig(tool);
      return <Tool {...toolCfg} items={tool.items || []} key={i.toString()} />;
    });
  };
  render() {
    return <div className="renderContainer">{<Renderer />}</div>;
  }
}

module.exports = {
  Html5Renderer: assign(Html5Renderer),
  reducers: {},
  epics: {}
};
