const React = require("react");
const { withState, withHandlers, compose } = require("recompose");
const Slider = require("rc-slider").default;

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
        <Slider
          className="Slider"
          defaultValue={props.startValue}
          min={-100}
          max={100}
          step={1}
          onChange={value => props.handleSlider(value)}
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
