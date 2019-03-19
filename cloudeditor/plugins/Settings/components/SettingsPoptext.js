const React = require("react");
const Select = require("react-select").default;

const settingsPoptext = props => {
  const className = "settingsPoptext " + (props.className || "");
  return (
    <div className={className}>
      <div className="headerPoptextTitle">{props.title}</div>
      <Select
        value={props.selectedOption}
        onChange={option => props.onChange(props.name, option)}
        options={props.options}
        name={props.name}
        classNamePrefix="headerPoptextSelect"
        style={{ boxShadow: "none" }}
      />
    </div>
  );
};

module.exports = settingsPoptext;
