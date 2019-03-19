const React = require("react");
const { keys } = require("ramda");

const selection = props => {
  const className = props.className;
  const options = keys(props.options).map(el => {
    return (
      <option key={el} value={el}>
        {props.options[el]}
      </option>
    );
  });
  return (
    <div className={className}>
      <div className="inputLabel">{props.label}</div>
      <div className="inputLabelContent">
        <select
          onChange={props.changePoptextValue}
          value={props.value}
          name={props.name}
        >
          {options}
        </select>
      </div>
    </div>
  );
};

module.exports = selection;
