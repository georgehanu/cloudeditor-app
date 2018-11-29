import React from "react";
import { withNamespaces } from "react-i18next";

const MenuHeader = props => {
  return (
    <div className="MenuHeader">
      <div className="TitleMenu">{props.t(props.title)}</div>
      <a
        href="#"
        className="CloseMenu"
        onClick={e => {
          e.preventDefault();
          props.modalClosed();
        }}
      />
    </div>
  );
};

export default withNamespaces("designAndGo")(MenuHeader);
