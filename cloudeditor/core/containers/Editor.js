const React = require("react");
const { Provider } = require("react-redux");
const PluginsContainer = require("./PluginsContainer");
const { hot } = require("react-hot-loader");

const { DragDropContextProvider } = require("react-dnd");
const HTML5Backend = require("react-dnd-html5-backend");

class Editor extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <DragDropContextProvider backend={HTML5Backend}>
          <PluginsContainer
            mode="desktop"
            plugins={this.props.plugins}
            pluginsConfig={this.props.pluginsConfig}
            component={this.props.component}
            className={this.props.className}
            id={this.props.id}
          />
        </DragDropContextProvider>
      </Provider>
    );
  }
}

module.exports = hot(module)(Editor);
