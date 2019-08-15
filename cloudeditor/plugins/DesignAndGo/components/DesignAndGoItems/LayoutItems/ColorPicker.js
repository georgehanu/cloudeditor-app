const React = require("react");
const { HuePicker } = require("react-color");

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
      ...prevState,
      showPicker: true
    };
  }

  render() {
    const className =
      "ColorButton" + (this.props.active ? " ColorButtonActive" : "");

    const containerBgColorStyle = this.props.containerBgColor
      ? { backgroundColor: this.props.containerBgColor }
      : {};

    return (
      <React.Fragment>
        <div className={className} onClick={this.onColorClicked}>
          <div className="ColorButtonBg" style={{ ...containerBgColorStyle }} />
        </div>
        {this.state.showPicker && (
          <div className="ColorPicker">
            <HuePicker
              onChangeComplete={color => {
                this.props.handleColorChange(color);
                /* this.props.changeColorVariableValue({
                  color1:
                    "rgb(" +
                    color.rgb.r +
                    "," +
                    color.rgb.g +
                    "," +
                    color.rgb.b +
                    ")"
                }); */
              }}
              color={this.props.containerBgColor}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

module.exports = ColorButton;
