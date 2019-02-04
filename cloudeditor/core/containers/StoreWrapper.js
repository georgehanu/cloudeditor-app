const React = require("react");
const { ReactReduxContext } = require("react-redux");

const PluginsContainer = require("./PluginsContainer");

class StoreWrapper extends React.Component {
  render() {
    return (
      <ReactReduxContext.Consumer>
        {({ store }) => {
          return <PluginsContainer {...this.props} store={store} />;
        }}
      </ReactReduxContext.Consumer>
    );
  }
}

module.exports = StoreWrapper;
