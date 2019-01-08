const React = require("react");
const { withNamespaces } = require("react-i18next");

class ColorPicker extends React.Component {
  state = {
    hexColor: "#000000",
    CMYK: "",
    Hex: "",
    RGB: "",
    htmlRGB: "",
    CMYK_C: "0",
    CMYK_M: "0",
    CMYK_Y: "0",
    CMYK_K: "100",
    RGB_R: "0",
    RGB_G: "0",
    RGB_B: "0"
  };

  changeColor = (CMYK, Hex, RGB, htmlRGB) => {
    this.setState({ CMYK, Hex, RGB, htmlRGB });
    this.setState({
      CMYK_C: parseInt(CMYK.c * 100),
      CMYK_M: parseInt(CMYK.m * 100),
      CMYK_Y: parseInt(CMYK.y * 100),
      CMYK_K: parseInt(CMYK.k * 100)
    });

    const rgb = RGB.split(" ");
    RGB_R = rgb[0];
    RGB_G = rgb[1];
    RGB_B = rgb[2];
    this.setState({ RGB_R, RGB_G, RGB_B });
  };

  onInputValueChange = event => {
    if (event.target.name === "CMYK_C")
      this.setState({ CMYK_C: event.target.value });
    else if (event.target.name === "CMYK_M")
      this.setState({ CMYK_M: event.target.value });
    else if (event.target.name === "CMYK_Y")
      this.setState({ CMYK_Y: event.target.value });
    else if (event.target.name === "CMYK_K")
      this.setState({ CMYK_K: event.target.value });
    else if (event.target.name === "RGB_R")
      this.setState({ RGB_R: event.target.value });
    else if (event.target.name === "RGB_G")
      this.setState({ RGB_G: event.target.value });
    else if (event.target.name === "RGB_B")
      this.setState({ RGB_B: event.target.value });
  };

  componentDidMount() {
    const picker = this;
    $("#colorPickerColorId").chromoselector({
      target: "#colorPickerId",
      autoshow: false,
      create: function() {
        $(this).chromoselector("show", 0);
      },
      width: 150,
      update: function() {
        const color = $(this).chromoselector("getColor");
        const CMYK = color.getCmyk();
        const Hex = color.getHexString();
        const RGB = color
          .getRgbString()
          .replace("rgb(", "")
          .replace(")", "")
          .replace(new RegExp(",", "g"), " ");
        const htmlRGB = color
          .getRgbString()
          .replace("rgb(", "")
          .replace(")", "");

        picker.changeColor(CMYK, Hex, RGB, htmlRGB);
      }
    });
  }
  onChangeColorHandler = event => {};

  onApplyRGB = () => {
    $("#colorPickerColorId").chromoselector(
      "setColor",
      "rgb(" +
        this.state.RGB_R +
        "," +
        this.state.RGB_G +
        "," +
        this.state.RGB_B +
        ")"
    );
  };

  onApplyCMYK = () => {
    $("#colorPickerColorId").chromoselector("setColor", {
      c: parseInt(this.state.CMYK_C) / 100,
      m: parseInt(this.state.CMYK_M) / 100,
      y: parseInt(this.state.CMYK_Y) / 100,
      k: parseInt(this.state.CMYK_K) / 100
    });
  };

  onOkHandler = () => {
    const CMYK =
      "" +
      this.state.CMYK.c.toFixed(3) +
      " " +
      this.state.CMYK.m.toFixed(3) +
      " " +
      this.state.CMYK.y.toFixed(3) +
      " " +
      this.state.CMYK.k.toFixed(3);
    const RGB =
      "" +
      (this.state.RGB_R / 255).toFixed(3) +
      " " +
      (this.state.RGB_G / 255).toFixed(3) +
      " " +
      (this.state.RGB_B / 255).toFixed(3);
    this.props.uiAddColorHandler({
      color: { htmlRGB: this.state.Hex, RGB, CMYK },
      activeTab: this.props.tabType
    });

    this.props.closePickerWnd();
  };

  closeWndHanlder = () => {
    $("#colorPickerColorId").chromoselector("setColor", "rgb(0,0,0)");

    this.props.closePickerWnd();
  };

  render() {
    const className =
      "colorPickerContainer " +
      (this.props.visible ? "" : "hideColorPickerContainer");
    return (
      <div className={className}>
        <div id="colorPickerId" className="colorPickerContainerChromoselector">
          <input
            className="colorPickerChromoselectorField"
            id="colorPickerColorId"
            type="text"
            value={this.state.hexColor}
            onChange={this.onChangeColorHandler}
          />
        </div>
        <div className="colorPickerValuesContainer">
          <div className="colorPickerCMYKContainer">
            <ul>
              <li>
                <span>C</span>
                <input
                  type="text"
                  value={this.state.CMYK_C}
                  onChange={this.onInputValueChange}
                  name="CMYK_C"
                />
              </li>
              <li>
                <span>M</span>
                <input
                  type="text"
                  value={this.state.CMYK_M}
                  onChange={this.onInputValueChange}
                  name="CMYK_M"
                />
              </li>
              <li>
                <span>Y</span>
                <input
                  type="text"
                  value={this.state.CMYK_Y}
                  onChange={this.onInputValueChange}
                  name="CMYK_Y"
                />
              </li>
              <li>
                <span>K</span>
                <input
                  type="text"
                  value={this.state.CMYK_K}
                  onChange={this.onInputValueChange}
                  name="CMYK_K"
                />
              </li>
            </ul>

            <button onClick={this.onApplyCMYK}>
              {this.props.t("Change CMYK")}
            </button>
          </div>
          <div className="colorPickerRGBContainer">
            <ul>
              <li>
                <span>R</span>
                <input
                  type="text"
                  value={this.state.RGB_R}
                  onChange={this.onInputValueChange}
                  name="RGB_R"
                />
              </li>
              <li>
                <span>G</span>
                <input
                  type="text"
                  value={this.state.RGB_G}
                  onChange={this.onInputValueChange}
                  name="RGB_G"
                />
              </li>
              <li>
                <span>B</span>
                <input
                  type="text"
                  value={this.state.RGB_B}
                  onChange={this.onInputValueChange}
                  name="RGB_B"
                />
              </li>
            </ul>
            <button onClick={this.onApplyRGB}>
              {this.props.t("Change RGB")}
            </button>
          </div>
          <div className="colorPickerOKContainer">
            <button onClick={this.closeWndHanlder}>
              {this.props.t("Cancel")}
            </button>
            <button className="buttonOk" onClick={this.onOkHandler}>
              {this.props.t("OK")}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = withNamespaces("translate")(ColorPicker);
