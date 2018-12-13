const React = require("react");
const { withNamespaces } = require("react-i18next");
require("./TableHeader.css");

const TableHeader = props => {
  const label = props.expanded ? props.t("Hide") : props.t("Preview");
  return (
    <div className="HeaderContainer">
      <span>{props.t(props.text)}</span>
      <div className="PreviewContainer">
        <button onClick={props.handleClick}>{label}</button>
      </div>
    </div>
  );
};

/*
<tr>
      <th colSpan="20" style={fupaThStyle}>
        <span style={fupaThStyleSpan}>{props.t(props.text)}</span>
        <div className="PreviewContainer">
          <button onClick={props.handleClick}>{label}</button>
        </div>
      </th>
    </tr>


*/

module.exports = withNamespaces("fupa")(TableHeader);
