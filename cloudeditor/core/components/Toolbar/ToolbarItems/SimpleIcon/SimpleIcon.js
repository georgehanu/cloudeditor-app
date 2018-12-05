const React = require("react");
const Utils = require("../../ToolbarConfig/utils");

const SimpleIcon = props => {
  let defaultClasses = ["SimpleIcon", "icon"];

  let threshold = 0;
  if (props.threshold) {
    threshold = parseInt(props.threshold);
  }
  let rangeClassName = props.range[0].className;
  let indexClass = 0;
  for (let idx in props.range) {
    if (props.range[idx].value < threshold) {
      //rangeClassName = props.range[idx].className;
      indexClass = parseInt(idx) + 1;
    }
  }
  if (indexClass >= props.range.length) {
    rangeClassName = props.range[props.range.length - 1].className;
  } else {
    rangeClassName = props.range[indexClass].className;
  }
  const className = Utils.MergeClassName(defaultClasses, rangeClassName);

  return (
    <div className="SimpleIconContainer">
      <span className={className} onClick={props.clicked} />
    </div>
  );
};

module.exports = SimpleIcon;
