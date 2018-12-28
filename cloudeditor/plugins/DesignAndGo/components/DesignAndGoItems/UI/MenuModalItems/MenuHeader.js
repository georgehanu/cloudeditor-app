const React = require("react");
const { withNamespaces } = require("react-i18next");

const MenuHeader = props => {
  return (
    <div className="MenuHeader">
      <div className="TitleMenu">{props.t(props.title)}</div>
      <a
        href="#"
        className="closeMenu"
        onClick={e => {
          e.preventDefault();
          props.modalClosed();
        }}
      />
    </div>
  );
};

module.exports = withNamespaces("designAndGo")(MenuHeader);
