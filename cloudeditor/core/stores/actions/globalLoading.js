const {
  START_GLOBAL_LOADING,
  STOP_GLOBAL_LOADING
} = require("../actionTypes/globalLoading");

const { createActions } = require("redux-actions");

const { startGlobalLoading, stopGlobalLoading } = createActions(
  START_GLOBAL_LOADING,
  STOP_GLOBAL_LOADING
);

module.exports = {
  startGlobalLoading,
  stopGlobalLoading
};
