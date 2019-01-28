const React = require("react");
const Slider = require("rc-slider").default;

const ColorBorderWidth = props => {
  return (
    <div className="ColorTabWidthContainer">
      <div className="ColorBorderWidthLeft">
        <span className={props.className} />
      </div>
      <div className="ColorBorderWidthRight">
        <Slider
          className="ColorBorderWidthSlider"
          defaultValue={props.defaultValue}
          min={0}
          max={10}
          step={1}
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
    </div>
  );
};

module.exports = ColorBorderWidth;
