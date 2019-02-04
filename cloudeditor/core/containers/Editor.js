const React = require("react");
const { Provider } = require("react-redux");
const StoreWrapper = require("./StoreWrapper");

class Editor extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <StoreWrapper
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

module.exports = Editor;
