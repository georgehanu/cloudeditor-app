const React = require("react");

const headerWnd = props => {
  return (
    <div className="headerWnd">
      <div className="titleMenu">{props.title}</div>
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

module.exports = headerWnd;
