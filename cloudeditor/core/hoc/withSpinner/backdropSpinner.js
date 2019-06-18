const React = require("react");
const withSpinner = require("./withSpinner");

const backdropSpinner = props => {
  return <div className="backdropSpinner" />;
};

module.exports = withSpinner(backdropSpinner);
