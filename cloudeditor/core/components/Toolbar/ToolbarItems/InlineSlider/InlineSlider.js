const React = require("react");
const Utils = require("../../ToolbarConfig/utils");
const Slider = require("rc-slider").default;
require("rc-slider/assets/index.css");

const InlineSlider = props => {
  const parentClassName =
    Utils.MergeClassName("InlineSlider", props.parentClassName) +
    " " +
    (props.defaultValue === -1 ? "noCrop" : "");
  let startValue = 0;
  if (props.defaultValue) {
    startValue = props.defaultValue;
  }

  return (
    //printqicon-user-tie
    <div className={parentClassName}>
      <div
        className="inlineSliderNoCropIcon icon awesome-user"
        onMouseDown={() => {
          props.ToolbarHandler({
            mainHandler: true,
            payloadMainHandler: {
              value: { value: -1, activeAction: 2 },
              type: props.type
            }
          });
        }}
        onMouseUp={() => {
          props.ToolbarHandler({
            mainHandler: true,
            payloadMainHandler: {
              value: { value: -1, activeAction: 0 },
              type: props.type
            }
          });
        }}
      />
      <div className={"verticalBar"} />
      <div
        className={"rc-slider-handle dummySlider"}
        onMouseDown={() => {
          props.ToolbarHandler({
            mainHandler: true,
            payloadMainHandler: {
              value: { value: 0, activeAction: 0 },
              type: props.type
            }
          });
        }}
      />
      <Slider
        min={-1}
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
          let val = value;
          if (val == -0) {
            val = -1;
          }
          props.ToolbarHandler({
            mainHandler: true,
            payloadMainHandler: {
              value: { value: val, activeAction: 0 },
              type: props.type
            }
          });
        }}
      />
      <div
        className="inlineSliderCropIcon icon awesome-user"
        onMouseDown={() => {
          let value = props.defaultValue;
          if (props.defaultValue + 1 <= 100) {
            value = props.defaultValue + 1;
          }

          props.ToolbarHandler({
            mainHandler: true,
            payloadMainHandler: {
              value: { value, activeAction: 2 },
              type: props.type
            }
          });
        }}
        onMouseUp={() => {
          let value = props.defaultValue;
          if (props.defaultValue + 1 <= 100) {
            value = props.defaultValue + 1;
          }

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
