const React = require("react");
const { connect } = require("react-redux");
const {
  colorTabSelector,
  getActiveBlockColors,
  lastUsedColorsSelector
} = require("./../../../../../stores/selectors/ui");
const ColorPicker = require("./ColorPicker");

const {
  uiAddColor,
  uiAddLastUsedColor,
  uiRemoveColor
} = require("./../../../../../stores/actions/ui");

const { PICKER_MODE_VIEW, PICKER_MODE_ADD } = require("./ColorTabTypes");

class ColorTab extends React.Component {
  state = {
    showPickerWnd: false,
    pickerWndMode: "",
    activeColor: null,
    type: null
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.type !== prevState.type) {
      return {
        type: nextProps.type,
        showPickerWnd: false,
        activeColor: nextProps.activeColors[nextProps.activeTab]
      };
    }
    return null;
  }

  togglePickerWnd = (showPickerWnd, pickerWndMode, activeColor) => {
    this.setState({ showPickerWnd, pickerWndMode, activeColor });
  };

  closePickerWnd = () => {
    this.setState({ showPickerWnd: false });
  };

  useColorHandler = () => {
    const {
      htmlRGB,
      RGB,
      CMYK,
      separation,
      separationColorSpace,
      separationColor
    } = this.state.activeColor;
    this.props.uiAddLastUsedColor(this.state.activeColor.id);
    this.props.selectColor({
      mainHandler: true,
      payloadMainHandler: {
        type: this.props.type,
        value: {
          htmlRGB,
          RGB,
          CMYK,
          separation,
          separationColorSpace,
          separationColor
        }
      }
    });
  };

  deleteColorHandler = payload => {
    this.props.uiRemoveColor(payload);
    this.setState({ showPickerWnd: false });
  };

  render() {
    const activeColor =
      this.state.activeColor === null
        ? this.props.activeColors[this.props.activeTab]
        : this.state.activeColor;

    let colors = this.props.colors.map((color, index) => {
      let colorCode = "";
      if (color.htmlRGB[0] === "#") colorCode = color.htmlRGB;
      else colorCode = "rgb(" + color.htmlRGB + ")";
      const selectedColor = activeColor.id
        ? activeColor.id === color.id
        : activeColor.htmlRGB === color.htmlRGB;
      return (
        <li
          key={color.id}
          style={{ backgroundColor: colorCode }}
          className={
            "ColorSquare " +
            (color.htmlRGB === "255,255,255" ? "whiteColorSquare" : "")
          }
          onClick={() => {
            this.togglePickerWnd(true, PICKER_MODE_VIEW, color);
          }}
        >
          {selectedColor && <b className="icon printqicon-ok SelectedColor" />}
        </li>
      );
    });

    colors.push(
      <li
        key={-1}
        className="ColorSquare AddColor"
        onClick={() => {
          this.togglePickerWnd(true, PICKER_MODE_ADD, this.state.activeColor);
        }}
        id="newColor"
      >
        {"+"}
      </li>
    );

    lastUsedColors = this.props.lastUsedColors.map((color, index) => {
      let colorCode1 = "";
      if (color.htmlRGB[0] === "#") colorCode1 = color.htmlRGB;
      else colorCode1 = "rgb(" + color.htmlRGB + ")";
      return (
        <li
          key={color.id + " " + index}
          style={{ backgroundColor: colorCode1 }}
          className={
            "ColorSquare " +
            (color.htmlRGB === "255,255,255" ? "whiteColorSquare" : "")
          }
          onClick={() => {
            this.togglePickerWnd(true, PICKER_MODE_VIEW, color);
          }}
        />
      );
    });
    return (
      <div className="ColorTabColorContainer">
        <ul className="ColorTabColorContainerUl">{colors}</ul>
        <div className="colorTabLastUsedContainer">
          <div className="colorTabLastUsedText">Last used colors</div>
          <ul className="colorTabLastUsedUl">{lastUsedColors}</ul>
        </div>
        <ColorPicker
          closePickerWnd={this.closePickerWnd}
          uiAddColorHandler={this.props.uiAddColor}
          uiRemoveColorHandler={this.deleteColorHandler}
          tabType={this.props.type}
          activeColor={this.state.activeColor}
          visible={this.state.showPickerWnd}
          mode={this.state.pickerWndMode}
          useColorHandler={this.useColorHandler}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    colors: colorTabSelector(state, props),
    activeColors: getActiveBlockColors(state, props),
    lastUsedColors: lastUsedColorsSelector(state, props)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    uiAddColor: payload => dispatch(uiAddColor(payload)),
    uiAddLastUsedColor: payload => dispatch(uiAddLastUsedColor(payload)),
    uiRemoveColor: payload => dispatch(uiRemoveColor(payload))
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ColorTab);
