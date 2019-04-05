const React = require("react");

const Input = props => {
  const className = "InputLabelContainer";
  const maxLength = props.maxLength ? props.maxLength : 999999;
  const inputType = props.type ? props.type : "text";
  const containerClass =
    "Input " +
    props.class +
    (props.invalidMessage !== null ? " InputInvalid" : "");
  return (
    <div className={containerClass}>
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

        <label className="InputInvalidMessage">
          {props.invalidMessage !== null ? props.invalidMessage : " "}
        </label>
      </label>
    </div>
  );
};

module.exports = Input;
