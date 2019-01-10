const React = require("react");

const input = props => {
  const className = "inputLabelContainer";
  const maxLenght = props.maxLenght ? props.maxLenght : 25;
  const inputType = props.type ? props.type : "text";
  return (
    <div className={props.class}>
      <label className={className}>
        <div className="inputLabel">{props.label}</div>
        <div className="inputLabelContent">
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

module.exports = input;
