const React = require("react");
const Utils = require("../../../ToolbarConfig/utils");

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
        <input
          className="SliderPopupSlider"
          type="range"
          defaultValue={startValue}
          min={min}
          max={max}
          step={step}
          onChange={event =>
            props.ToolbarHandler({
              mainHandler: true,
              payloadMainHandler: {
                type: props.settingsHandler,
                value: event.target.value
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
