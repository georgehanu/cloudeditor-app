const React = require("react");
const Utils = require("../../ToolbarConfig/utils");
const Slider = require("rc-slider").default;
require("rc-slider/assets/index.css");

const InlineSlider = props => {
  const parentClassName = Utils.MergeClassName(
    "InlineSlider",
    props.parentClassName
  );
  let startValue = 0;
  if (props.defaultValue) {
    startValue = props.defaultValue;
  }

  return (
    <div className={parentClassName}>
      <Slider
        min={0}
        max={100}
        step={1}
        value={startValue}
        onChange={value => {
          props.ToolbarHandler({
            mainHandler: true,
            payloadMainHandler: {
              value: { value, activeAction: 1 },
              type: props.type
            }
          });
        }}
        onAfterChange={value => {
          props.ToolbarHandler({
            mainHandler: true,
            payloadMainHandler: {
              value: { value, activeAction: 0 },
              type: props.type
            }
          });
        }}
      />
    </div>
  );
};
module.exports = InlineSlider;
