const React = require("react");
const { connect } = require("react-redux");
const BlockMessage = require("../BlockMesage/BlockMessage");

const ErrorMessage = props => {
  const objects = { ...props.objects };
  const { viewOnly } = props;
};
module.exports = connect(
  null,
  null
)(ErrorMessage);
