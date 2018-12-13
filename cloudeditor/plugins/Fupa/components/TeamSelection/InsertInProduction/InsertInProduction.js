const React = require("react");
const { withNamespaces } = require("react-i18next");

require("./InsertInProduction.css");

const InsertInProduction = props => {
  return (
    <div className="InsertInProductionContainer">
      <button onClick={() => props.handleClick()}>
        {props.t("Insert in production")}
      </button>
    </div>
  );
};

module.exports = withNamespaces("fupa")(InsertInProduction);
