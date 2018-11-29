const React = require("react");

require("./Error.css");

const error = props => <div className="error">{props.errorMsg}</div>;

module.exports = error;
