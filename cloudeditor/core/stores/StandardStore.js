const { combineReducers, combineEpics } = require("../utils/PluginsUtils");
const { createDebugStore } = require("../utils/DebugUtils");
const projectEpics = require("../stores/epics/project");

const standardEpics = {
  ...projectEpics
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
    ui: require("../stores/reducers/ui")
  });

  const rootEpic = combineEpics(plugins, { ...appEpics, ...standardEpics });

  const defaultState = initialState.defaultState;

  const store = createDebugStore(rootReducer, rootEpic, defaultState);
  return store;
};
