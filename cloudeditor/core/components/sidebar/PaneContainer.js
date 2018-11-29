const React = require("react");
const BackButton = require("./BackButton");

const PaneContainer = props => {
  const className =
    "PaneContainer " + (props.visible ? "PaneShow" : "PaneHidden");
  return (
    <div className={className}>
      <BackButton clicked={props.clicked} />
      {props.children}
    </div>
  );
};

module.exports = PaneContainer;
