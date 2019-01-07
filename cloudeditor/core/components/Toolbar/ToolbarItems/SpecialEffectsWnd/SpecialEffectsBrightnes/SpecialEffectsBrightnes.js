const React = require("react");

const BrightnessSlider = require("./BrightnessSlider");
const { withState, withHandlers, compose } = require("recompose");

const SpecialEffectsBrightnes = props => {
  let brightness = props.brightnessValue;
  let contrast = props.contrastValue;
  if (props.effect.brightness !== undefined) {
    brightness = props.effect["brightness"];
  }
  if (props.effect.contrast !== undefined) {
    contrast = props.effect["contrast"];
  }

  const decBrightness = parseFloat(brightness) / 100 + 1;
  const decContrast = parseFloat(contrast) / 100 + 1;

  const filter =
    " brightness(" +
    decBrightness +
    ") contrast(" +
    decContrast +
    ") " +
    (props.brightnessFilter ? props.brightnessFilter : "");
  const visible = props.visible === "false" ? "none" : "block";

  let filterString = "";
  let flipStyle = "";
  if (props.filter.length) {
    filterString = props.filter + "(1)";
  }
  filterString += filter;
  switch (props.flip) {
    case "flip_horizontal":
      flipStyle = "scaleX(-1)";
      break;
    case "flip_vertical":
      flipStyle = "scaleY(-1)";
      break;
    case "flip_both":
      flipStyle = "scale(-1)";
      break;
  }
  const filterStyle = {
    filter: filterString,
    transform: flipStyle
  };
  return (
    <div
      className="SpecialEffectsBrightnessImageContainer"
      style={{ display: visible }}
    >
      <img
        src={props.image}
        style={filterStyle}
        className={props.brightnessClass}
        alt=""
      />
      <div>
        <BrightnessSlider
          text="Brightness"
          startValue={brightness}
          handler={props.handleSlider}
        />
        <BrightnessSlider
          text="Contrast"
          startValue={contrast}
          handler={props.handleSlider}
        />
      </div>
    </div>
  );
};

const enhance = compose(
  withState("effect", "setEffect", {}),
  withHandlers({
    handleSlider: props => (text, value) => {
      let newValue = { ...props.effect };
      if (text === "Brightness") {
        newValue["brightness"] = value;
      } else {
        newValue["contrast"] = value;
      }
      props.setEffect(newValue);
      props.ToolbarHandler({
        mainHandler: true,
        payloadMainHandler: {
          type: text,
          value
        },
        keepDetailsWnd: true
      });
    }
  })
);
module.exports = enhance(SpecialEffectsBrightnes);
