const React = require("react");

const submenuData = props => {
  const className = "iconCategory " + props.iconClass;
  return (
    <li>
      <div className="submenuDataContainer">
        <i class={className} />
        {props.children}
      </div>
    </li>
  );
};

module.exports = submenuData;
