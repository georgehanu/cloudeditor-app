const React = require("react");

require("./InsertInProduction.css");

const insertInProduction = props => {
  return (
    <div className="InsertInProductionContainer">
      <button onClick={() => props.handleClick()}>
        {props.t("Insert in production")}
      </button>
    </div>
  );
};

module.exports = insertInProduction;
