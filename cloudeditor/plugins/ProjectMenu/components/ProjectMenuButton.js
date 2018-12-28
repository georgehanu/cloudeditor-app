const React = require("react");

const projectMenuButton = props => {
  let defaultClasses = ["projectMenuButton"];
  if (props.active) {
    defaultClasses.push("projectMenuButtonActive");
  }

  const className = defaultClasses.join(" ");
  return (
    <button type="button" onClick={props.clicked} className={className}>
      <div className="buttonName">{props.children}</div>
      <div className="buttonIcon">
        <span className="icon stadion-down stadion-icon" />
      </div>
    </button>
  );
};

module.exports = projectMenuButton;
