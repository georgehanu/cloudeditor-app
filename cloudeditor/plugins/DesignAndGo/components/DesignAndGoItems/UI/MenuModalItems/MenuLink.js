const React = require("react");

const MenuLink = props => {
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();

        props.clicked();
      }}
    >
      {props.linkName}
    </a>
  );
};

module.exports = MenuLink;
