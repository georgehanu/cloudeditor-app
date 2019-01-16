const React = require("react");

const PageHeader = props => {
  return (
    <div className="pageSelectorHeader">
      <div className="pageHeaderText">
        <div
          className="pageHeaderTextTitleContainer"
          onClick={props.showAddPages}
        >
          <span className="icon fupa-add-pages" />
          <span className="pageHeaderTextTitle">{props.title}</span>
        </div>
        <div className="pageHeaderTextInfoContainer">
          <span className="icon fupa-info" />
          <span className="pageHeaderTextTitle">{props.dragMessage}</span>
        </div>
      </div>
      <div className="pageHeaderButtonsContainer">
        {props.showExtend && (
          <button className="pageHeaderButtonExtend" onClick={props.extend}>
            <span className="icon porto-up" />
          </button>
        )}
        {props.showMinimized && (
          <button className="pageHeaderButtonMinimize" onClick={props.minimize}>
            <span className="icon porto-down" />
          </button>
        )}
      </div>
    </div>
  );
};

module.exports = PageHeader;
