const React = require("react");
const { Provider } = require("react-redux");
const PluginsContainer = require("./PluginsContainer");
const { hot } = require("react-hot-loader");

class Editor extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <PluginsContainer
          mode="desktop"
          plugins={this.props.plugins}
          pluginsConfig={this.props.pluginsConfig}
          component={this.props.component}
          className={this.props.className}
          id={this.props.id}
        />
      </Provider>
    );
  }
}

module.exports = hot(module)(Editor);
