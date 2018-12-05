const React = require("react");

const PageHeader = props => {
  return (
    <div className="PageSelectorHeader">
      <div className="PageHeaderText">PAGES</div>
      <div className="PageHeaderButtonsContainer">
        {props.showExtend && (
          <button className="PageHeaderButtonExtend" onClick={props.extend}>
            EX
            <div className="icon icon-chevron-down chevron-down" />
          </button>
        )}
        {props.showMinimized && (
          <button className="PageHeaderButtonMinimize" onClick={props.minimize}>
            MI
            <div className="icon icon-chevron-down chevron-down" />
          </button>
        )}
      </div>
    </div>
  );
};

module.exports = { PageHeader };
