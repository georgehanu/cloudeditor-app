const React = require("react");
const withSpinner = require("../../../../core/hoc/withSpinner/withSpinner");

const Loading = props => {
  return <div className="loadingSpinner">Loa</div>;
};

module.exports = withSpinner(Loading);
