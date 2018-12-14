const React = require("react");
const BackButton = require("./BackButton");

const paneContainer = props => {
  const className =
    "paneContainer " + (props.visible ? "paneShow" : "paneHidden");
  return (
    <div className={className}>
      <BackButton clicked={props.clicked} />
      {props.children}
    </div>
  );
};

module.exports = paneContainer;
