const React = require("react");
const { Provider } = require("react-redux");
const PluginsContainer = require("./PluginsContainer");

class Editor extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <div id="wrapper" className="toggled">
          <PluginsContainer
            mode="desktop"
            plugins={this.props.plugins}
            pluginsConfig={this.props.pluginsConfig}
          />
          asdadad
        </div>
      </Provider>
    );
  }
}

module.exports = Editor;
