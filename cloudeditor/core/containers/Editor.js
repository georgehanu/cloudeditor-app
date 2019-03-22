const React = require("react");
const { Provider } = require("react-redux");
const StoreWrapper = require("./StoreWrapper");
const ConfigUtils = require("../utils/ConfigUtils");

class Editor extends React.Component {
  init = () => {
    this.props.initialActions.forEach(action => {
      action(this.props.store, ConfigUtils);
    });
    this.props.initialStoreActions.forEach(action => {
      this.props.store.dispatch(action());
    });
  };

  componentDidMount() {
    this.init();
  }
  render() {
    return this.props.store ? (
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
    ) : null;
  }
}

module.exports = Editor;
