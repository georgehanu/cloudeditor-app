import React from "react";
import { withNamespaces } from "react-i18next";

const MenuLink = props => {
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();

        props.clicked();
      }}
    >
      {props.linkName}
    </a>
  );
};

export default withNamespaces("designAndGo")(MenuLink);
