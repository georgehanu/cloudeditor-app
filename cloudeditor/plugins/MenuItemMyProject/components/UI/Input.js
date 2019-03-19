const React = require("react");

const input = props => {
  const className = "inputLabelContainer " + (props.empty ? "inputEmpty" : "");
  const inputType = props.type ? props.type : "text";
  return (
    <div className={props.class}>
      <label className={className}>
        <div className="inputLabel">{props.label}</div>
        <div className="inputLabelContent">
          <input
            type={inputType}
            defaultValue={props.text}
            onChange={props.onInputChange}
            name={props.name}
            placeholder={props.placeholder}
          />
        </div>
      </label>
    </div>
  );
};

module.exports = input;
