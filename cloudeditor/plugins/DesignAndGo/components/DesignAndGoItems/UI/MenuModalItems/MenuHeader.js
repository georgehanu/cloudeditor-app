const React = require("react");
const { withNamespaces } = require("react-i18next");

const MenuHeader = ({ className = "MenuHeader", ...props }) => {
  return (
    <div className={className}>
      <div className="TitleMenu">{props.t(props.title)}</div>
      <a
        href="#"
        className="CloseMenu"
        onClick={e => {
          e.preventDefault();
          props.modalClosed();
        }}
      />
    </div>
  );
};

module.exports = withNamespaces("designAndGo")(MenuHeader);
