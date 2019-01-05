const React = require("react");
//const { withNamespaces } = require("react-i18next");

const PageHeader = props => {
  return (
    <div className="pageSelectorHeader">
      <div className="pageHeaderText">PAGES</div>
      <div className="pageHeaderButtonsContainer">
        {props.showExtend && (
          <button className="pageHeaderButtonExtend" onClick={props.extend}>
            <span className="icon stadion-up stadion-icon" />
          </button>
        )}
        {props.showMinimized && (
          <button className="pageHeaderButtonMinimize" onClick={props.minimize}>
            <span className="icon stadion-down stadion-icon" />
          </button>
        )}
      </div>
      <div className="pageAddPagesContainer">
        <button
          className="pageHeaderButtonAddPages"
          onClick={props.showAddPages}
        >
          Add pages
        </button>
      </div>
    </div>
  );
};

module.exports = PageHeader;
