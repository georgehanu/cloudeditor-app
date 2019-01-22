const React = require("react");
const withSpinner = require("../../../../core/hoc/withSpinner/withSpinner");

const Loading = props => {
  return <div className="loadingSpinner" />;
};

module.exports = withSpinner(Loading);
