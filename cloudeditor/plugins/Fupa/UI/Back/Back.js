const React = require("react");

require("./Back.css");

const back = props => {
  return (
    <div className="backButton">
      <button onClick={() => props.clicked()}>{props.msg}</button>
    </div>
  );
};

module.exports = back;
