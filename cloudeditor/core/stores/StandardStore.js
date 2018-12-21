const { combineReducers, combineEpics } = require("../utils/PluginsUtils");
const { createDebugStore } = require("../utils/DebugUtils");
const projectEpics = require("../stores/epics/project");
const assetsEpics = require("../stores/epics/assets");

const standardEpics = {
  ...projectEpics,
  ...assetsEpics
};

module.exports = (
  initialState = { defaultState: {}, mobile: {} },
  appReducers = {},
  appEpics = {},
  plugins = {}
) => {
  const rootReducer = combineReducers(plugins, {
    ...appReducers,
    project: require("../stores/reducers/project"),
    ui: require("../stores/reducers/ui"),
    assets: require("../stores/reducers/assets"),
    variables: require("../stores/reducers/variables")
  });

  const rootEpic = combineEpics(plugins, { ...appEpics, ...standardEpics });

  const defaultState = initialState.defaultState;

  const store = createDebugStore(rootReducer, rootEpic, defaultState);
  return store;
};
