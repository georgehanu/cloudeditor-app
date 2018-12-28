const React = require("react");

const importPoptext = props => {
  const options = props.options.map((el, index) => {
    return (
      <option key={index} value={index}>
        {el}
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
