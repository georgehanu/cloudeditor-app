const React = require("react");

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

  if (props.colorPicker) {
    let counter = items.length;
    items.push(
      <ColorPicker
        key={counter}
        containerBgColor={props.palleteBgColor}
        handleColorChange={props.dagChangeColorPicker}
        clicked={() => {
          props.dagChangeActiveColorSchema(counter);
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
