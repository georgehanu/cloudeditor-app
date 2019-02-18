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
              value: value,
              type: props.type
            }
          });
        }}
        onMouseUp={event => {
          const evt = new Event("update_crop_params");
          document.dispatchEvent(evt);
        }}
      />
    </div>
  );
};
module.exports = InlineSlider;
