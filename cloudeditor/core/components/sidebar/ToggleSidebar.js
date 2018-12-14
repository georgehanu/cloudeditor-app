const React = require("react");

const ToggleSidebar = props => {
  const icon =
    "icon " +
    (props.expanded ? "printqicon-cancel" : "printqicon-maximizemenu");
  return (
    <div className="ToggleSidebarContainer">
      <button onClick={props.clicked}>
        <span className={icon} />
      </button>
    </div>
  );
};

module.exports = ToggleSidebar;
