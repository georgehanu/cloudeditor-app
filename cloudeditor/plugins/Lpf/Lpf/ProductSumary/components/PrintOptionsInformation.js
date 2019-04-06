const React = require("react");
const { withNamespaces } = require("react-i18next");
const printOptionsValue = props => {
  const values = props.values.map((item, index) => {
    return (
      <div className="printOptionValue" key={index}>
        {item}
      </div>
    );
  });
  return (
    <div className="informationContainer">
      <div className="pageOptionTitle">{props.name}</div>
      {values}
    </div>
  );
};
module.exports = withNamespaces("panels")(printOptionsValue);
