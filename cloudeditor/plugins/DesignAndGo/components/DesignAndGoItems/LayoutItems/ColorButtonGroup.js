const React = require("react");

const ColorButton = require("./ColorButton");
const ColorPicker = require("./ColorPicker");
const {
  dagColorsSelector,
  dagActiveColorButtonSelector
} = require("../../../store/selectors");
const {
  dagChangeActiveColorSchema,
  dagChangeColorPicker
} = require("../../../store/actions");

const { connect } = require("react-redux");

const ColorButtonGroup = props => {
  const items = props.colors.map((el, index) => {
    if (el.colorPicker === undefined || el.colorPicker === false)
      return (
        <ColorButton
          key={index}
          {...el}
          clicked={() => props.dagChangeActiveColorSchema(index)}
          active={props.activeColorButton === index}
        />
      );
    else
      return (
        <ColorPicker
          key={index}
          {...el}
          handleColorChange={props.dagChangeColorPicker}
          clicked={() => props.dagChangeActiveColorSchema(index)}
          active={props.activeColorButton === index}
        />
      );
  });
  return (
    <div className={props.class}>
      <label className="InputLabelContainer">
        <span>{props.label}</span>
        <div className="ColorButtonContainer">{items}</div>
      </label>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    colors: dagColorsSelector(state),
    activeColorButton: dagActiveColorButtonSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dagChangeActiveColorSchema: buttonIndex =>
      dispatch(dagChangeActiveColorSchema(buttonIndex)),
    dagChangeColorPicker: color => dispatch(dagChangeColorPicker(color))
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ColorButtonGroup);
