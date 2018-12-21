const React = require("react");

const Backdrop = props =>
  props.show ? (
    <div className="PageSelectorBackdrop" onClick={props.clicked} />
  ) : null;

module.exports = Backdrop;
