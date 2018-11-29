const React = require("react");
const PropTypes = require("prop-types");
const { componentFromProp } = require("recompose");
const PluginsUtils = require("../utils/PluginsUtils");
const logger = require("../utils/LoggerUtils");

const Component = componentFromProp("component");

class PluginsContainer extends React.Component {
  getPluginDescriptor = plugin => {
    return PluginsUtils.getPluginDescriptor(
      this.getStore,
      this.props.plugins,
      this.props.pluginsConfig[this.props.mode],
      plugin
    );
  };

  renderPlugins = plugins => {
    logger.info("plugins", plugins);
    return plugins
      .filter(
        Plugin =>
          !PluginsUtils.handleExpression(this.getStore, Plugin.hide || false)
      )
      .map(this.getPluginDescriptor)
      .filter(plugin =>
        PluginsUtils.filterDisabledPlugins(
          { plugin: (plugin && plugin.impl) || plugin },
          this.getStore
        )
      )
      .filter(this.filterPlugins)
      .map(Plugin => (
        <Plugin.impl
          key={Plugin.id}
          {...this.props.params}
          {...Plugin.cfg}
          pluginCfg={Plugin.cfg}
          items={Plugin.items}
        />
      ));
  };

  getStore = () => {
    return this.context.store;
  };

  render() {
    const pluginsConfig =
      this.props.pluginsConfig && this.props.pluginsConfig[this.props.mode]
        ? this.props.pluginsConfig[this.props.mode]
        : this.props.pluginsConfig[this.props.defaultMode];
    if (pluginsConfig) {
      const {
        bodyPlugins,
        ...containerPlugins
      } = PluginsUtils.mapPluginsPosition(pluginsConfig);
      const containerProps = Object.keys(containerPlugins).reduce(
        (o, k) => ({
          ...o,
          [k]: this.renderPlugins(containerPlugins[k])
        }),
        {}
      );

      return (
        <Component
          id={this.props.id}
          className={this.props.className}
          style={this.props.style}
          component={this.props.component}
          {...containerProps}
        >
          {this.renderPlugins(bodyPlugins)}
        </Component>
      );
    }
    return null;
  }

  filterPlugins = Plugin => {
    const container = PluginsUtils.getMorePrioritizedContainer(
      Plugin.impl,
      this.props.pluginsConfig[this.props.mode],
      0
    );
    return (
      !container.plugin ||
      !container.plugin.impl ||
      container.plugin.impl.doNotHide
    );
  };
}

PluginsContainer.propTypes = {
  mode: PropTypes.oneOf(["desktop", "mobile"]),
  plugins: PropTypes.object,
  pluginsConfig: PropTypes.object,
  component: PropTypes.any,
  id: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  defaultMode: PropTypes.string
};

PluginsContainer.defaultProps = {
  mode: "desktop",
  plugins: {},
  pluginsConfig: {},
  component: "div",
  id: "plugins-container",
  style: {},
  className: "plugins-container",
  defaultMode: "desktop"
};

PluginsContainer.contextTypes = {
  store: PropTypes.object
};

module.exports = PluginsContainer;
