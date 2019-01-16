const React = require("react");
const PropTypes = require("prop-types");
const { componentFromProp } = require("recompose");
const isEqual = require("react-fast-compare");
const PluginsUtils = require("../utils/PluginsUtils");

const Component = componentFromProp("component");

const { checkChangedProps } = require("../utils/UtilUtils");

class PluginsContainer extends React.Component {
  state = {
    additionalClasses: [],
    test: 1
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (isEqual(nextState, this.state) && isEqual(this.props, nextProps)) {
      return false;
    }
    return true;
  }
  getPluginDescriptor = plugin => {
    return PluginsUtils.getPluginDescriptor(
      this.getStore,
      this.props.plugins,
      this.props.pluginsConfig[this.props.mode],
      plugin
    );
  };
  addContainerClasses = (pluginName, newClassesArray, resizePageEvent) => {
    let newClasses = [...this.state.additionalClasses];
    let index = newClasses.findIndex((el, index) => {
      return el.pluginName === pluginName;
    });
    if (index === -1) {
      newClasses.push({ pluginName, pluginClasses: newClassesArray });
    } else {
      newClasses[index] = { pluginName, pluginClasses: newClassesArray };
    }
    /* Change to have an additional param */
    this.setState({ additionalClasses: newClasses }, () => {
      if (resizePageEvent) {
        var event = new Event("resizePage");
        window.dispatchEvent(event);
      }
    });
  };

  renderPlugins = plugins => {
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
          pluginCfg={Plugin.cfg}
          items={Plugin.items}
          addContainerClasses={this.addContainerClasses}
        />
      ));
  };

  getStore = () => {
    return this.props.store;
  };

  componentDidMount() {
    console.log("12345");
  }
  componentDidUpdate() {
    //console.log("123456");
  }

  render() {
    //console.log("pluginContainer123");
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
      let newClasses = [];
      for (let plugin in this.state.additionalClasses) {
        newClasses.push(...this.state.additionalClasses[plugin].pluginClasses);
      }

      const classes = [this.props.className, ...newClasses].join(" ");
      return (
        <Component
          id={this.props.id}
          className={classes}
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
  id: "pluginsContainer",
  style: {},
  className: "pluginsContainer",
  defaultMode: "desktop"
};

module.exports = PluginsContainer;
