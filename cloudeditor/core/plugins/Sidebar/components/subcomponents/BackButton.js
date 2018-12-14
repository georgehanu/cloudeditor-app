const React = require("react");

const backButton = props => {
  const icon = "icon printqicon-cancel";

  return (
    <div className="backButtonContainer">
      <button onClick={props.clicked}>
        <span className={icon} />
      </button>
    </div>
  );
};

module.exports = backButton;
