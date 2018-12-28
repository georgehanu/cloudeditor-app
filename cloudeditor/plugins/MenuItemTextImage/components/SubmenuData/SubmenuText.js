const React = require("react");
const SubmenuData = require("./SubmenuData");
const { withNamespaces } = require("react-i18next");

const submenuText = props => {
  return (
    <ul className="submenuContainer">
      <SubmenuData iconClass="textContent">
        <p className="submenuHeading">{props.t("Text and content")}</p>
        <p className="submenuItem disabled">
          {props.t("Insert new text area")}
        </p>
        <p
          className="submenuItem"
          onClick={() => props.showModalImportHandler(false, true)}
        >
          {props.t("Select and insert sayings / quotes")}
        </p>
      </SubmenuData>

      <SubmenuData iconClass="textFavourite">
        <p className="submenuHeading">{props.t("Your Favourites")}</p>
        <p
          className="submenuItem"
          onClick={() => props.showModalImportHandler(true, true)}
        >
          {props.t("Select and insert sayings / quotes")}
        </p>
      </SubmenuData>
    </ul>
  );
};

module.exports = withNamespaces("menuItemTextImage")(submenuText);
