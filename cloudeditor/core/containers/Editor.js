const React = require("react");
const { Provider } = require("react-redux");
const PluginsContainer = require("./PluginsContainer");
const { I18nextProvider } = require("react-i18next");
const { hot } = require("react-hot-loader");

class Editor extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <I18nextProvider i18n={this.props.i18n}>
          <div id="wrapper" className="toggled">
            <PluginsContainer
              mode="desktop"
              plugins={this.props.plugins}
              pluginsConfig={this.props.pluginsConfig}
            />
          </div>
        </I18nextProvider>
      </Provider>
    );
  }
}

module.exports = hot(module)(Editor);
