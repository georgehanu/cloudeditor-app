const React = require("react");

const duplicate = props => {
  return (
    <div className="duplicateContainer headerSubContainer">
      <div className="duplicateLabel">{props.label}</div>
      <div className="duplicateChecked">
        <input
          type="checkbox"
          name={props.name}
          checked={props.checked}
          onChange={props.onChange}
        />
      </div>
    </div>
  );
};

module.exports = duplicate;
