import React from "react";
import { withNamespaces } from "react-i18next";
import "./InsertInProduction.css";

const InsertInProduction = props => {
  return (
    <div className="InsertInProductionContainer">
      <button>{props.t("Insert in production")}</button>
    </div>
  );
};

export default withNamespaces("fupa")(InsertInProduction);
