import React from "react";

const Input = props => {
  const className = "InputLabelContainer";
  const maxLenght = props.maxLenght ? props.maxLenght : 25;
  const inputType = props.type ? props.type : "text";
  return (
    <div className={props.class}>
      <label className={className}>
        <span>{props.label}</span>
        <div className="InputLabelContent">
          <input
            type={inputType}
            maxLength={maxLenght}
            value={props.text}
            onChange={props.onInputChange}
            name={props.name}
          />
        </div>
      </label>
    </div>
  );
};

export default Input;
