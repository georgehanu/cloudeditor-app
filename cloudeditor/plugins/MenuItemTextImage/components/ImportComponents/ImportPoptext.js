const React = require("react");
const { keys } = require("ramda");

const importPoptext = props => {
  const options = keys(props.options).map(el => {
    return (
      <option key={el} value={el}>
        {props.options[el]}
      </option>
    );
  });
  return (
    <div className="importPoptext">
      <label>{props.label + " :"}</label>
      <select
        onChange={props.changePoptextValue}
        value={props.value}
        name={props.name}
      >
        {options}
      </select>
    </div>
  );
};

module.exports = importPoptext;
