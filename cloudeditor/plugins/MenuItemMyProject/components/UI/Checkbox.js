const React = require("react");

const checkbox = props => {
  return (
    <div className="checkboxLabelContainer">
      <div className="checkboxContainer">
        <input
          type="checkbox"
          name={props.name}
          checked={props.selected}
          onChange={props.onChangeCheckbox}
        />
        <div className="checkboxLabel">{props.label}</div>
      </div>
    </div>
  );
};

module.exports = checkbox;
