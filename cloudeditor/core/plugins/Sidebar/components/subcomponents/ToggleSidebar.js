const React = require("react");

const toggleSidebar = props => {
  const icon =
    "icon " +
    (props.expanded ? "printqicon-cancel" : "printqicon-maximizemenu");
  return (
    <div className="toggleSidebarContainer">
      <button onClick={props.clicked}>
        <span className={icon} />
      </button>
    </div>
  );
};

module.exports = toggleSidebar;
