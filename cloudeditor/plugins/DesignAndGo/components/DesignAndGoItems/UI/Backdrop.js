const React = require("react");

const Backdrop = props =>
  props.show ? <div className="Backdrop" onClick={props.clicked} /> : null;

module.exports = Backdrop;
