const React = require("react");
require("./Backdrop.css");

const Backdrop = props =>
  props.show ? (
    <div className={props.classBackdrop} onClick={props.clicked} />
  ) : null;

module.exports = Backdrop;
