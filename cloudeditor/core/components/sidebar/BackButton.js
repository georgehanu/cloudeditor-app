import React from "react";

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

export default BackButton;
