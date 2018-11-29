const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const Renderer = require("../components/Renderer/Html5");
const { withI18n } = require("react-i18next");
const { hot } = require("react-hot-loader");

const { activePageSelector } = require("../stores/selectors/project");
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
    const { t, tReady } = this.props;
    return (
      <div className="render-container">
        {t("title")}
        {<Renderer {...this.props.activePage} />}
      </div>
    );
  }
}

// let's export the plugin and a set of required reducers
const mapStateToProps = state => {
  return {
    activePage: activePageSelector(state)
  };
};

const Html5RendererPlugin = hot(module)(
  withI18n()(connect(mapStateToProps)(Html5Renderer))
);
module.exports = {
  Html5Renderer: assign(Html5RendererPlugin),
  reducers: {},
  epics: {}
};
