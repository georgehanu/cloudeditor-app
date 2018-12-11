const React = require("react");

const ColorBorderWidth = props => {
  return (
    <div className="ColorTabWidthContainer">
      <div className="ColorBorderWidthLeft">
        <span className={props.className} />
      </div>
      <div className="ColorBorderWidthRight">
        <input
          className="ColorBorderWidthSlider"
          type="range"
          defaultValue={props.defaultValue}
          min="0"
          max="10"
          step="1"
          onChange={event =>
            props.selectWidth({
              mainHandler: true,
              payloadMainHandler: {
                type: props.type,
                value: parseFloat(event.target.value)
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
