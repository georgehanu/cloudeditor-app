const React = require("react");

const input = props => {
  const className = "headerSubContainer " + props.className;
  const inputType = props.type ? props.type : "text";
  return (
    <div className={className}>
      <div className="inputLabel">{props.label}</div>
      <div className="inputLabelContent">
        <input
          type={inputType}
          value={props.text}
          onChange={props.onChange}
          name={props.name}
        />
      </div>
    </div>
  );
};

module.exports = input;
