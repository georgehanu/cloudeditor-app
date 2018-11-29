module.exports = (plugins, requires, localConfig, i18n) => {
  const startApp = () => {
    const React = require("react");
    const ReactDOM = require("react-dom");
    const assign = require("object-assign");

    const Editor = require("./core/containers/Editor");
    const ConfigUtils = require("./core/utils/ConfigUtils");
    const PluginsUtils = require("./core/utils/PluginsUtils");
    const StandardStore = require("./core/stores/StandardStore");

    ConfigUtils.loadConfiguration(localConfig);

    const store = StandardStore({}, {}, {}, plugins);

    const editorConfig = {
      store,
      i18n,
      plugins: assign(PluginsUtils.getPlugins(plugins), { requires }),
      pluginsConfig: ConfigUtils.getConfigProp("plugins")
    };

    ReactDOM.render(
      <Editor {...editorConfig} />,
      document.getElementById("app")
    );
  };

  startApp();
  return true;
};
