const React = require("react");
const Utils = require("../../../ToolbarConfig/utils");
const Slider = require("rc-slider").default;

const SliderWnd = props => {
  const parentClassName = Utils.MergeClassName("Slider", props.parentClassName);
  const popupIcon = (
    <span
      className={Utils.MergeClassName("SliderPopupIcon", props.className)}
    />
  );
  let startValue = 0;
  if (props.defaultValue) {
    startValue = props.defaultValue;
  }

  let min = props.min !== undefined ? props.min : "0";
  let max = props.max !== undefined ? props.max : "100";
  let step = props.step !== undefined ? props.step : "1";

  return (
    <div className={parentClassName}>
      <div className="SliderPopup">
        {popupIcon}
        <Slider
          className="SliderPopupSlider"
          defaultValue={startValue}
          min={parseInt(min, 10)}
          max={parseInt(max, 10)}
          step={parseInt(step, 10)}
          onChange={value =>
            props.ToolbarHandler({
              mainHandler: true,
              payloadMainHandler: {
                type: props.settingsHandler,
                value: value
              },
              keepDetailsWnd: true
            })
          }
        />
      </div>
    </div>
  );
};

module.exports = SliderWnd;
