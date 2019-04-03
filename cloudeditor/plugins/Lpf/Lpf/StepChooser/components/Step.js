const React = require("react");
require("./Step.css");
const { withNamespaces } = require("react-i18next");
const step = props => {
  const stepClasses = [
    "step",
    props.code === props.activeStep ? "activeStep" : ""
  ].join(" ");
  return (
    <div
      className={stepClasses}
      onClick={() => {
        props.changeStepHandler({ code: props.code });
      }}
    >
      <span className={"orderNumber"}>{props.order}</span>.
      <span className={"stepLabel"}>{props.t(props.label)}</span>
    </div>
  );
};

module.exports = withNamespaces("step")(step);
