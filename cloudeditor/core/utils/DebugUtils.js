const { createStore, compose, applyMiddleware } = require("redux");
const thunkMiddleware = require("redux-thunk").default;
const { createEpicMiddleware } = require("redux-observable");

const DebugUtils = {
  createDebugStore: function(reducer, epic, initialState, userMiddlewares) {
    const composeEnhancers =
      process.env.NODE_ENV !== "production" &&
      typeof window === "object" &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : compose;

    const epicMiddleware = createEpicMiddleware();

    let middlewares = [thunkMiddleware, epicMiddleware].concat(
      userMiddlewares || []
    );

    const store = createStore(
      reducer,
      composeEnhancers(applyMiddleware.apply(null, middlewares))
    );

    epicMiddleware.run(epic);
    return store;
  }
};

module.exports = DebugUtils;
