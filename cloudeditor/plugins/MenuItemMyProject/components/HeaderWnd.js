const React = require("react");
const { withNamespaces } = require("react-i18next");

const headerWnd = props => {
  return (
    <div className="headerWnd">
      <div className="titleMenu">{props.t(props.title)}</div>
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

module.exports = withNamespaces("menuItemMyProject")(headerWnd);
