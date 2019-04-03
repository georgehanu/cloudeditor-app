const { combineReducers, combineEpics } = require("../utils/PluginsUtils");
const { createDebugStore } = require("../utils/DebugUtils");
const { createUndoReducer } = require("@intactile/redux-undo-redo");
const undoHistory = createUndoReducer();

module.exports = (
  initialState = { defaultState: {}, mobile: {} },
  appReducers = {},
  appEpics = {},
  plugins = {}
) => {
  const rootReducer = combineReducers(plugins, {
    ...appReducers,
    undoHistory: undoHistory,
    auth: require("../../plugins/ProjectMenu/store/reducers")
  });

  const rootEpic = combineEpics(plugins, { ...appEpics });

  const defaultState = initialState.defaultState;

  const store = createDebugStore(rootReducer, rootEpic, defaultState);
  return store;
};
