const React = require("react");
const SubmenuData = require("./SubmenuData");
const { withNamespaces } = require("react-i18next");

const submenuImage = props => {
  return (
    <ul className="submenuContainer">
      <SubmenuData iconClass="imageContent">
        <p className="submenuHeading">
          {props.t("Pictures / Logos / Decorations")}
        </p>
        <p class="submenuItem disabled">{props.t("Insert new image area")}</p>
        <p class="submenuItem">
          {props.t("Select and insert your own pictures / logos")}
        </p>
        <p class="submenuItem">
          {props.t("Select and insert decorative / cliparts")}
        </p>
      </SubmenuData>
      <SubmenuData iconClass="imageFavourite">
        <p className="submenuHeading">{props.t("Your Favourites")}</p>
        <p class="submenuItem">{props.t("Select and insert images / logos")}</p>
        <p class="submenuItem">
          {props.t("Select and insert decorative / cliparts")}
        </p>
      </SubmenuData>
    </ul>
  );
};

module.exports = withNamespaces("menuItemTextImage")(submenuImage);
