const React = require("react");
const convert = require("color-convert");

const ColorButton = require("./ColorButton");
const ColorPicker = require("./ColorPicker");

const {
  dagChangeActiveColorSchema,
  dagChangeColorPicker
} = require("../../../store/actions");
const {
  changeColorVariableValue
} = require("../../../../../core/stores/actions/variables");
const { connect } = require("react-redux");

const ColorButtonGroup = props => {
  let items = props.colors.map((el, index) => {
    return (
      <ColorButton
        key={index}
        {...el}
        clicked={() => {
          props.dagChangeActiveColorSchema(index);
          props.changeColorVariableValue(el);
        }}
        active={props.activeColorButton === index}
      />
    );
  });

  const changeColorPicker = color => {
    const decimals = 1000;
    const rgb = color.rgb;
    const CMYK = convert.rgb.cmyk.raw(rgb.r, rgb.g, rgb.b);
    const palleteBgColor = {
      htmlRGB: rgb.r + "," + rgb.g + "," + rgb.b,
      RGB:
        Math.round((rgb.r / 255) * decimals) / decimals +
        " " +
        Math.round((rgb.g / 255) * decimals) / decimals +
        " " +
        Math.round((rgb.b / 255) * decimals) / decimals,
      CMYK:
        Math.round((CMYK[0] / 100) * decimals) / decimals +
        " " +
        Math.round((CMYK[1] / 100) * decimals) / decimals +
        " " +
        Math.round((CMYK[2] / 100) * decimals) / decimals +
        " " +
        Math.round((CMYK[3] / 100) * decimals) / decimals
    };

    props.dagChangeColorPicker(palleteBgColor);
    props.changeColorVariableValue({ color1: palleteBgColor });
  };

  if (props.colorPicker) {
    let counter = items.length;
    items.push(
      <ColorPicker
        key={counter}
        containerBgColor={"rgb(" + props.palleteBgColor.htmlRGB + ")"}
        handleColorChange={changeColorPicker}
        clicked={() => {
          props.dagChangeActiveColorSchema(counter);
          props.changeColorVariableValue({ color1: props.palleteBgColor });
        }}
        active={props.activeColorButton === counter}
        changeColorVariableValue={props.changeColorVariableValue}
      />
    );
  }
  return (
    <div className="Input ColorButtonGroup">
      <label className="InputLabelContainer">
        <span>{"Options"}</span>
        <div className="ColorButtonContainer">{items}</div>
      </label>
    </div>
  );
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    dagChangeActiveColorSchema: buttonIndex =>
      dispatch(dagChangeActiveColorSchema(buttonIndex)),
    dagChangeColorPicker: color => dispatch(dagChangeColorPicker(color)),
    changeColorVariableValue: color => dispatch(changeColorVariableValue(color))
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ColorButtonGroup);
