const React = require("react");

const BackButton = props => {
  const icon = "icon printqicon-cancel";

  return (
    <div className="BackButtonContainer">
      <button onClick={props.clicked}>
        <span className={icon} />
      </button>
    </div>
  );
};

module.exports = BackButton;
