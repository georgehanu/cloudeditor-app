import React from "react";

import ColorButton from "./ColorButton";
import ColorPicker from "./ColorPicker";
import {
  dagColorsSelector,
  dagActiveColorButtonSelector
} from "../../../../stores/selectors/designAndGo";
import {
  dagChangeActiveColorSchema,
  dagChangeColorPicker
} from "../../../../stores/actions/designAndGo";

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColorButtonGroup);
