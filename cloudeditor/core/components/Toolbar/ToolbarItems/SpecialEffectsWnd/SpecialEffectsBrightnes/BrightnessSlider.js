const React = require("react");
const { withState, withHandlers, compose } = require("recompose");

const BrightnessSlider = props => {
  let slValue = props.sliderValue;
  if (props.sliderValue === null) {
    slValue = props.startValue;
  }

  return (
    <div className="BrightnessSliderContainer">
      <div className="LeftContainer">
        <span className="Title">{props.text}</span>
      </div>
      <div className="RightContainer">
        <input
          className="Slider"
          type="range"
          defaultValue={props.startValue}
          onChange={event => props.handleSlider(event.target.value)}
          min="-100"
          max="100"
          step="1"
        />
        <span className="SliderValue">{slValue}</span>
      </div>
    </div>
  );
};

const enhance = compose(
  withState("sliderValue", "setSliderValue", null),
  withHandlers({
    handleSlider: props => value => {
      props.setSliderValue(parseInt(value));

      props.handler(props.text, value);
    }
  })
);
module.exports = enhance(BrightnessSlider);
