import React from "react";
import { HuePicker } from "react-color";

class ColorButton extends React.Component {
  state = {
    showPicker: false
  };

  onColorClicked = () => {
    this.props.clicked();
    this.setState({ showPicker: !this.state.showPicker });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.active === false) {
      return {
        ...prevState,
        showPicker: false
      };
    }
    return {
      ...prevState
    };
  }

  render() {
    const className =
      "ColorButton" + (this.props.active ? " ColorButtonActive" : "");

    const containerBgColorStyle = this.props.containerBgColor
      ? { backgroundColor: this.props.containerBgColor }
      : {};

    console.log("aa " + this.state.showPicker);

    return (
      <React.Fragment>
        <div className={className} onClick={this.onColorClicked}>
          <div className="ColorButtonBg" style={{ ...containerBgColorStyle }} />
        </div>
        {this.state.showPicker && (
          <div className="ColorPicker">
            <HuePicker
              onChangeComplete={color => this.props.handleColorChange(color)}
              color={this.props.containerBgColor}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default ColorButton;
