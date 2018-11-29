const { combineReducers } = require("redux");
const { omit, is, head } = require("ramda");
const assign = require("object-assign");
const queryString = require("query-string");
const { combineEpics } = require("redux-observable");
const { catchError } = require("rxjs/operators");

const getPluginItems = (store, plugins, pluginsConfig, name, id, isDefault) => {
  return Object.keys(plugins)
    .filter(plugin => plugins[plugin][name])
    .filter(plugin => {
      const cfgObj = isPluginConfigured(pluginsConfig, plugin);
      return cfgObj && showIn(store, cfgObj, name, id, isDefault);
    })
    .filter(
      plugin =>
        getMorePrioritizedContainer(
          plugins[plugin],
          pluginsConfig,
          plugins[plugin][name].priority || 0
        ).plugin === null
    )
    .map(pluginName => {
      const pluginImpl = plugins[pluginName];
      const pluginCfg = isPluginConfigured(pluginsConfig, pluginName);
      const item = pluginImpl[name].impl || pluginImpl[name];
      return assign(
        {
          name: pluginName
        },
        item,
        (pluginCfg.override && pluginCfg.override[name]) || {},
        {
          cfg: assign(
            {},
            pluginImpl.cfg || {},
            (pluginCfg && parsePluginConfig(store, pluginCfg.cfg || {})) ||
              undefined
          )
        },
        {
          plugin: pluginImpl,
          items: getPluginItems(
            store,
            plugins,
            pluginsConfig,
            pluginName,
            null,
            true
          )
        }
      );
    })
    .filter(item => filterDisabledPlugins(item, store));
};

const getReducers = plugins =>
  Object.keys(plugins)
    .map(name => plugins[name].reducers)
    .reduce((previous, current) => assign({}, previous, current), {});

const getEpics = plugins =>
  Object.keys(plugins)
    .map(name => plugins[name].epics)
    .reduce((previous, current) => assign({}, previous, current), {});

const isPluginConfigured = (pluginsConfig, pluginName) => {
  const cfg = pluginsConfig;
  return head(
    cfg.filter(cfgObj => cfgObj.name === pluginName || cfgObj === pluginName)
  );
};

/*eslint-disable */
const parseExpression = (store = {}, value) => {
  const searchExpression = /^\{(.*)\}$/;
  const expression = searchExpression.exec(value);
  const request = queryString.parse(location.search);
  const dispatch = action => {
    return () => store().dispatch(action.apply(null, arguments));
  };
  if (expression !== null) {
    return eval(expression[1]);
  }
  return value;
};
/*eslint-enable */
/**
 * Parses a expression string "{some javascript}" and evaluate it.
 * The expression will be evaluated getting as parameters the state and the context and the request.
 * @memberof utils.PluginsUtils
 * @param  {object} state      the state context
 * @param  {object} context    the context element
 * @param  {string} expression the expression to parse, it's a string
 * @return {object}            the result of the expression
 * @example "{1===0 && request.query.queryParam1=paramValue1}"
 * @example "{1===0 && context.el1 === 'checked'}"
 */
const handleExpression = (store, expression) => {
  if (is(String, expression) && expression.indexOf("{") === 0) {
    return parseExpression(store, expression);
  }
  return expression;
};

const parsePluginConfig = (store, cfg) => {
  if (is(Array, cfg)) {
    return cfg.map(value => parsePluginConfig(store, value));
  }
  if (is(Object, cfg)) {
    return Object.keys(cfg).reduce((previous, current) => {
      const value = cfg[current];
      return assign(previous, {
        [current]: parsePluginConfig(store, value)
      });
    }, {});
  }
  return parseExpression(store, cfg);
};

/**
 * filters the plugins passed evaluating the dsiablePluginIf expression with the given context
 * @memberof utils.PluginsUtils
 * @param  {Object} item         the plugins
 * @param  {function} [state={}]   The state to evaluate
 * @param  {Object} [plugins={}] the plugins object to get requires
 * @return {Boolean}             the result of the expression evaluation in the given context.
 */
const filterDisabledPlugins = (item, store = {}) => {
  const disablePluginIf =
    (item && item.plugin && item.plugin.disablePluginIf) ||
    (item.cfg && item.cfg.disablePluginIf);
  if (disablePluginIf && !(item && item.cfg && item.cfg.skipAutoDisable)) {
    return !handleExpression(store, disablePluginIf);
  }
  return true;
};

const showIn = (store, cfg, name, id, isDefault) => {
  return (
    ((id &&
      cfg.showIn &&
      handleExpression(store, cfg.showIn).indexOf(id) !== -1) ||
      (cfg.showIn &&
        handleExpression(store, cfg.showIn).indexOf(name) !== -1) ||
      (!cfg.showIn && isDefault)) &&
    !(
      (cfg.hideFrom &&
        handleExpression(store, cfg.hideFrom).indexOf(name) !== -1) ||
      (id &&
        cfg.hideFrom &&
        handleExpression(store, cfg.hideFrom).indexOf(id) !== -1)
    )
  );
};

const getMorePrioritizedContainer = (pluginImpl, plugins, priority) => {
  return plugins.reduce(
    (previous, current) => {
      const pluginName = current.name || current;
      return pluginImpl[pluginName] &&
        pluginImpl[pluginName].priority > previous.priority
        ? {
            plugin: {
              name: pluginName,
              impl: pluginImpl[pluginName]
            },
            priority: pluginImpl[pluginName].priority
          }
        : previous;
    },
    { plugin: null, priority: priority }
  );
};

/**
 * default wrapper for the epics.
 * @memberof utils.PluginsUtils
 * @param {epic} epic the epic to wrap
 * @return {epic} epic wrapped with error catch and re-subscribe functionalities.S
 *
 * https://github.com/redux-observable/redux-observable/issues/94
 */
const defaultEpicWrapper = epic => (...args) =>
  epic(...args).pipe(
    catchError((error, source) => {
      console.info(`${epic}: caught an error.`, error, source);
      setTimeout(() => {
        throw error;
      }, 0);
      return source;
    })
  );

const PluginsUtils = {
  /**
   * Produces the reducers from the plugins, combined with other plugins
   * @param {array} plugins the plugins
   * @param {object} [reducers] other reducers
   * @returns {function} a reducer made from the plugins' reducers and the reducers passed as 2nd parameter
   */
  combineReducers: (plugins, reducers) => {
    const pluginsReducers = getReducers(plugins);
    return combineReducers(assign({}, reducers, pluginsReducers));
  },

  combineEpics: (plugins, epics = {}, epicWrapper = defaultEpicWrapper) => {
    const pluginEpics = assign({}, getEpics(plugins), epics);
    return combineEpics(
      ...Object.keys(pluginEpics)
        .map(k => pluginEpics[k])
        .map(epicWrapper)
    );
  },

  mapPluginsPosition: (pluginsConfig = []) => {
    let plugins = pluginsConfig.reduce((o, p) => {
      const position = (p.cfg && p.cfg.containerPosition) || "bodyPlugins";
      return {
        ...o,
        [position]: o[position] ? [...o[position], p] : [p]
      };
    }, {});
    return plugins;
  },

  getPlugins: plugins => {
    return Object.keys(plugins)
      .map(name => plugins[name])
      .reduce(
        (previous, current) =>
          assign({}, previous, omit(["reducers", "epics"], current)),
        {}
      );
  },

  getPluginDescriptor: (store, plugins, pluginsConfig, pluginDef) => {
    const name = is(Object, pluginDef) ? pluginDef.name : pluginDef;
    const id = is(Object, pluginDef) ? pluginDef.id : null;
    const stateSelector = is(Object, pluginDef)
      ? pluginDef.stateSelector
      : id || undefined;
    const isDefault = is(Object, pluginDef)
      ? (typeof pluginDef.isDefault === "undefined" && true) ||
        pluginDef.isDefault
      : true;
    const pluginKey = is(Object, pluginDef) ? pluginDef.name : pluginDef;
    const impl = plugins[pluginKey];
    if (!impl) {
      return null;
    }

    return {
      id: id || name,
      name,
      impl,
      cfg: assign(
        {},
        impl.cfg || {},
        is(Object, pluginDef) ? parsePluginConfig(store, pluginDef.cfg) : {}
      ),
      items: getPluginItems(store, plugins, pluginsConfig, name, id, isDefault)
    };
  },

  handleExpression,
  filterDisabledPlugins,
  getMorePrioritizedContainer,
  defaultEpicWrapper
};

module.exports = PluginsUtils;
