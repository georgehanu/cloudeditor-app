const React = require("react");
const withSpinner = require("../../../core/hoc/withSpinner/withSpinner");

const LoadingItem = props => {
  return <div />;
};

module.exports = withSpinner(LoadingItem);
