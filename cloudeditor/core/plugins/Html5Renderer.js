const React = require("react");
const assign = require("object-assign");
const Renderer = require("../components/Renderer/Html5");
const { flatten } = require("ramda");
const uuidv4 = require("uuid/v4");
const { connect } = require("react-redux");
const {
  previewEnabeldSelector
} = require("../../plugins/PrintPreview/store/selectors");
require("./Html5Renderer/Html5Renderer.css");

class Html5Renderer extends React.Component {
  state = {
    uuid: uuidv4()
  };
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

  getBlurSelectors() {
    const tools = this.getTools();
    return flatten(
      tools.map((tool, i) => {
        return tool.blurSelectors;
      })
    );
  }

  render() {
    if (this.props.previewEnabled) {
      return null;
    }
    const blurSelectors = this.getBlurSelectors();
    return (
      <div className="renderContainer">
        {
          <Renderer
            facingPages={this.props.pluginCfg["facingPages"]}
            blurSelectors={blurSelectors}
            uuid={this.state.uuid}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    previewEnabled: previewEnabeldSelector(state)
  };
};

const Html5RendererPlugin = connect(
  mapStateToProps,
  null
)(Html5Renderer);

module.exports = {
  Html5Renderer: assign(Html5RendererPlugin, {
    cfg: { facingPages: false }
  }),
  reducers: {},
  epics: {}
};
