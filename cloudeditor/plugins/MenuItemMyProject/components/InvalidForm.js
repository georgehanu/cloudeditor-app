const React = require("react");
const withSpinner = require("../../../core/hoc/withSpinner/withSpinner");

const invalidForm = props => {
  return <React.Fragment>{props.errorMessage}</React.Fragment>;
};

module.exports = withSpinner(invalidForm);
