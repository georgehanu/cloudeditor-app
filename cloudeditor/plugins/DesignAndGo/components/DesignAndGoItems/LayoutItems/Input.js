const React = require("react");

const Input = props => {
  const className = "InputLabelContainer";
  const maxLength = props.maxLength ? props.maxLength : 100;
  const inputType = props.type ? props.type : "text";
  return (
    <div className={props.class}>
      <label className={className}>
        <span>{props.label}</span>
        <div className="InputLabelContent">
          <input
            type={inputType}
            maxLength={maxLength}
            value={props.text}
            onChange={props.onInputChange}
            name={props.name}
          />
        </div>
      </label>
    </div>
  );
};

module.exports = Input;
