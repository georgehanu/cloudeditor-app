const React = require("react");
const { connect } = require("react-redux");
const {
  colorTabSelector,
  getActiveBlockColors
} = require("./../../../../../stores/selectors/ui");
const ColorPicker = require("./ColorPicker");

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

  pickerWndHandler = value => {
    this.setState({ showPickerWnd: !this.state.showPickerWnd });
  };

  render() {
    let colors = this.props.colors.map((color, index) => {
      return (
        <li
          key={color.id}
          style={{ backgroundColor: color.htmlRGB }}
          className="ColorSquare"
          onClick={() => {
            const {
              htmlRGB,
              RGB,
              CMYK,
              separation,
              separationColorSpace,
              separationColor
            } = color;
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
          this.pickerWndHandler(true);
        }}
        id="newColor"
      >
        {"+"}
      </li>
    );
    return (
      <div className="ColorTabColorContainer">
        <ul className="">{colors}</ul>
        {this.state.showPickerWnd && <ColorPicker />}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    colors: colorTabSelector(state, props),
    activeColors: getActiveBlockColors(state, props)
  };
};
module.exports = connect(
  mapStateToProps,
  null
)(ColorTab);
