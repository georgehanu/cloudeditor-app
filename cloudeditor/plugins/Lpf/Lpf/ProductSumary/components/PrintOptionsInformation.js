const React = require("react");
const { withNamespaces } = require("react-i18next");
const printOptionsValue = props => {
  return (
    <div className="informationContainer">
      <div className="pageOptionTitle">{props.name}</div>
      <div className="printOptionValue">{props.value}</div>
    </div>
  );
};
module.exports = withNamespaces("panels")(printOptionsValue);
