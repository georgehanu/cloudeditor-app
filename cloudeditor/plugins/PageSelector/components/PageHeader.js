const React = require("react");

const PageHeader = props => {
  return (
    <div className="PageSelectorHeader">
      <div className="PageHeaderText">PAGES</div>
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
    </div>
  );
};

module.exports = { PageHeader };
