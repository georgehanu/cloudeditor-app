const { combineReducers, combineEpics } = require("../utils/PluginsUtils");
const { createDebugStore } = require("../utils/DebugUtils");
const projectEpics = require("../stores/epics/project");
const assetsEpics = require("../stores/epics/assets");
const { createUndoReducer } = require("@intactile/redux-undo-redo");
const undoHistory = createUndoReducer();
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
    variables: require("../stores/reducers/variables"),
    selection: require("../stores/reducers/selection"),
    productInformation: require("../stores/reducers/productinformation"),
    auth: require("../../plugins/ProjectMenu/store/reducers"),
    undoHistory: undoHistory,
    layoutTemplate: require("../stores/reducers/layout_template"),
    globalLoading: require("../stores/reducers/globalLoading")
  });

  const rootEpic = combineEpics(plugins, { ...appEpics, ...standardEpics });

  const defaultState = initialState.defaultState;

  const store = createDebugStore(rootReducer, rootEpic, defaultState);
  return store;
};
