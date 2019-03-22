module.exports = (plugins, requires, localConfig, i18n, initialActions) => {
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

    ConfigUtils.loadConfiguration(localConfig);

    const store = StandardStore({}, {}, {}, plugins);
    const mainComponentCfg = ConfigUtils.getConfigProp("mainComponent");

    ReselectTools.getStateWith(() => store.getState());

    const editorConfig = {
      store,
      plugins: assign(PluginsUtils.getPlugins(plugins), { requires }),
      pluginsConfig: ConfigUtils.getConfigProp("plugins"),
      initialActions,
      initialStoreActions: []
    };

    ReactDOM.render(
      <AppContainer>
        <Editor {...editorConfig} {...mainComponentCfg} />
      </AppContainer>,
      document.getElementById("app")
    );
  };

  startApp();
  return true;
};
