const React = require("react");
const { withNamespaces } = require("react-i18next");
const { head } = require("ramda");

const panelInformation = props => {
  const panels = props.panels;
  const panelsOrder = props.panelsOrder;
  const panelsInfo = panelsOrder.map((key, index) => {
    return (
      <div className="printOptionValue" key={panels[key]["id"]}>
        {panels[key].width} x {panels[key].height} {props.t("mm")}
      </div>
    );
  });
  return (
    <div className="informationContainer">
      <div className="pageOptionTitle">{props.t("Size:")}</div>
      {panelsInfo}
    </div>
  );
};

module.exports = withNamespaces("panels")(panelInformation);
