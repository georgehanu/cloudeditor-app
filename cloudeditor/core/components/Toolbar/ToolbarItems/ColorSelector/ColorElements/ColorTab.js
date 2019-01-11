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
  uiAddLastUsedColor
} = require("./../../../../../stores/actions/ui");

class ColorTab extends React.Component {
  state = {
    showPickerWnd: false,
    type: null
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.type !== prevState.type) {
      return {
        type: nextProps.type,
        showPickerWnd: false
      };
    }
    return null;
  }

  togglePickerWnd = showPickerWnd => {
    this.setState({ showPickerWnd });
  };

  closePickerWnd = () => {
    this.togglePickerWnd(false);
  };

  render() {
    let colors = this.props.colors.map((color, index) => {
      let colorCode = "";
      if (color.htmlRGB[0] === "#") colorCode = color.htmlRGB;
      else colorCode = "rgb(" + color.htmlRGB + ")";
      return (
        <li
          key={color.id}
          style={{ backgroundColor: colorCode }}
          className={
            "ColorSquare " +
            (color.htmlRGB === "255,255,255" ? "whiteColorSquare" : "")
          }
          onClick={() => {
            const {
              htmlRGB,
              RGB,
              CMYK,
              separation,
              separationColorSpace,
              separationColor
            } = color;
            this.props.uiAddLastUsedColor(color.id);
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
          }}
        >
          {this.props.activeColors[this.props.activeTab] === color.htmlRGB && (
            <b className="icon printqicon-ok SelectedColor" />
          )}
        </li>
      );
    });

    colors.push(
      <li
        key={-1}
        className="ColorSquare AddColor"
        onClick={() => {
          this.togglePickerWnd(true);
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
            const {
              htmlRGB,
              RGB,
              CMYK,
              separation,
              separationColorSpace,
              separationColor
            } = color;
            this.props.uiAddLastUsedColor(color.id);
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
          tabType={this.props.type}
          activeColor={this.props.activeColors[this.props.activeTab]}
          visible={this.state.showPickerWnd}
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
    uiAddLastUsedColor: payload => dispatch(uiAddLastUsedColor(payload))
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ColorTab);
