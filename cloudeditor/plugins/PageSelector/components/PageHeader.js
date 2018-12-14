const React = require("react");
const { withNamespaces } = require("react-i18next");

const PageHeader = props => {
  return (
    <div className="PageSelectorHeader">
      <div className="PageHeaderText">{props.t("PAGES")}</div>
      <div className="PageHeaderButtonsContainer">
        {props.showExtend && (
          <button className="PageHeaderButtonExtend" onClick={props.extend}>
            <span className="icon stadion-up stadion-icon" />
          </button>
        )}
        {props.showMinimized && (
          <button className="PageHeaderButtonMinimize" onClick={props.minimize}>
            <span className="icon stadion-down stadion-icon" />
          </button>
        )}
      </div>
      <div className="PageAddPagesContainer">
        <button
          className="PageHeaderButtonAddPages"
          onClick={props.showAddPages}
        >
          {props.t("Add pages")}
        </button>
      </div>
    </div>
  );
};

module.exports = withNamespaces("pageSelector")(PageHeader);
