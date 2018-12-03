const React = require("react");
const withSpinner = require("../../../../core/hoc/withSpinner");

const LoadingItem = props => {
  console.log("LoadingIte");
  return <div />;
};

module.exports = withSpinner(LoadingItem);
