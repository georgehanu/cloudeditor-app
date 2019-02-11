module.exports = (plugins, requires, localConfig) => {
  const startApp = () => {
    const React = require("react");
    const ReactDOM = require("react-dom");
    const assign = require("object-assign");
    const { AppContainer } = require("react-hot-loader");
    const ReselectTools = require("reselect-tools");

    const Editor = require("./core/containers/Editor");
    const ConfigUtils = require("./core/utils/ConfigUtils");
    const PluginsUtils = require("./core/utils/PluginsUtils");
    const StandardStore = require("./core/stores/StandardStore");
    const ErrorBoundary = require("./core/components/ErrorBoundary/ErrorBoundary");

    ConfigUtils.loadConfiguration(localConfig);
    require("./core/axios/project/axios").baseURL = ConfigUtils.getDefaults().baseUrl;

    const store = StandardStore({}, {}, {}, plugins);
    const mainComponentCfg = ConfigUtils.getConfigProp("mainComponent");

    ReselectTools.getStateWith(() => store.getState());

    const editorConfig = {
      store,
      plugins: assign(PluginsUtils.getPlugins(plugins), { requires }),
      pluginsConfig: ConfigUtils.getConfigProp("plugins")
    };

    ReactDOM.render(
      <AppContainer>
        <ErrorBoundary>
          <Editor {...editorConfig} {...mainComponentCfg} />
        </ErrorBoundary>
      </AppContainer>,
      document.getElementById("app")
    );
  };

  startApp();
  return true;
};
