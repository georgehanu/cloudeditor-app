const React = require("react");

const textarea = props => {
  const className = "inputLabelContainer";
  return (
    <div className={props.class}>
      <label className={className}>
        <div className="inputLabel">{props.label}</div>
        <div className="textareaLabelContent inputLabelContent">
          <textarea
            defaultValue={props.text}
            onChange={props.onInputChange}
            name={props.name}
            rows="3"
            placeholder={props.placeholder}
          />
        </div>
      </label>
    </div>
  );
};

module.exports = textarea;
