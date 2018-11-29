import React from "react";
import { withNamespaces } from "react-i18next";
import "./TableHeader.css";

const fupaThStyle = {
  backgroundColor: "#002e5f",
  color: "white",
  height: "35px",
  lineHeight: "35px",
  overflow: "hidden",
  position: "relative",
  textAlign: "left",
  verticalAlign: "middle",
  fontWeight: "normal",
  color: "white",
  margin: "0",
  textTransform: "uppercase",
  fontSize: "14px",
  padding: "0 0 0 10px"
};

const fupaThStyleSpan = {
  fontWeight: "bold",
  marginRight: "2px"
};

const TableHeader = props => {
  const label = props.expanded ? props.t("Hide") : props.t("Preview");
  return (
    <tr>
      <th colSpan="20" style={fupaThStyle}>
        <span style={fupaThStyleSpan}>{props.t(props.text)}</span>
        <div className="PreviewContainer">
          <button onClick={props.handleClick}>{label}</button>
        </div>
      </th>
    </tr>
  );
};

export default withNamespaces("fupa")(TableHeader);
