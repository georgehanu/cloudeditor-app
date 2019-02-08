const React = require("react");
const withSpinner = require("../../../../hoc/withSpinner/withSpinner");
const Button = require("../Button/Button");

const ButtonLoading = props => {
  return <Button {...props} />;
};
module.exports = withSpinner(ButtonLoading);
