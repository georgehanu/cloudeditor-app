const React = require("react");
const Slider = require("rc-slider").default;
const UncontrolledInput = require("../../UncontrolledInput/UncontrolledInput");

const ColorBorderWidth = props => {
  return (
    <div className="ColorTabWidthContainer">
      <div className="ColorBorderWidthLeft">
        <span className={props.className} />
      </div>
      <div className="ColorBorderWidthRight">
        <Slider
          className="ColorBorderWidthSlider"
          value={props.defaultValue}
          min={0}
          max={28.3465}
          step={0.7086625}
          onChange={value =>
            props.selectWidth({
              mainHandler: true,
              payloadMainHandler: {
                type: props.type,
                value: parseFloat(value)
              },
              keepDetailsWnd: true
            })
          }
        />
      </div>
      <UncontrolledInput
        displayedValue={props.defaultValue * 0.352778}
        defaultValue={props.defaultValue * 0.352778}
        selectWidth={props.selectWidth}
        type={props.type}
      />
    </div>
  );
};

module.exports = ColorBorderWidth;
