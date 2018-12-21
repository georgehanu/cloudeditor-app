const React = require("react");

const Utils = require("../../DesignAndGoConfig/utils");
const { withNamespaces } = require("react-i18next");

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

module.exports = withNamespaces("designAndGo")(Title);
