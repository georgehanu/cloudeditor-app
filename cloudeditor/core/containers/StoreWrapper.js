const React = require("react");
const { ReactReduxContext } = require("react-redux");

const PluginsContainer = require("./PluginsContainer");

class StoreWrapper extends React.Component {
  static contextType = ReactReduxContext;

  getStore = () => {
    return this.context.store;
  };

  render() {
    return <PluginsContainer {...this.props} store={this.context.store} />;
  }
}

module.exports = StoreWrapper;
