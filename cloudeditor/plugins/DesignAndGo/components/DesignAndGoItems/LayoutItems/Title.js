import React from "react";

import * as Utils from "../../DesignAndGoConfig/utils";
import { withNamespaces } from "react-i18next";

const Title = props => {
  const className = Utils.MergeClassName("TitleContainer", props.className);

  return (
    <div className={className}>
      <div className="Title" />
      <div className="MenuButtonContainerMobile">
        <a className="MenuButton" onClick={props.onMenuOpenHandler}>
          {props.t("MENU")}
        </a>
      </div>
    </div>
  );
};

export default withNamespaces("designAndGo")(Title);
