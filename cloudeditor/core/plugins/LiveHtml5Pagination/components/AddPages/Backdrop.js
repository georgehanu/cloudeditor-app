const React = require("react");

const Backdrop = props =>
  props.show ? (
    <div className="pageSelectorBackdrop" onClick={props.clicked} />
  ) : null;

module.exports = Backdrop;
