const React = require("react");
const { withNamespaces } = require("react-i18next");

class UncontrolledInput extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }
  shouldComponentUpdate(prevProps) {
    return prevProps.displayedValue !== this.props.displayedValue;
  }
  numberWithCommas = (x, precission) => {
    x = parseFloat(x.toFixed(precission));
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  };

  checkUpdatedValue() {
    let value = this.props.displayedValue;
    if (value === null) {
      value = this.props.defaultValue;
    }
    if (("" + value).includes(".") === false) {
      value += ".00";
    }

    return this.numberWithCommas(parseFloat(value), 3);
  }
  componentDidMount() {
    if (this.input) {
      const $input = $(this.input.current);
      $input.val(this.checkUpdatedValue());
      $input.on("blur", event => {
        this.updateOnChange(event);
      });
      $input.on("keypress", event => {
        if (event.key === "Enter") {
          this.updateOnChange(event);
        }
      });
    }
  }

  updateOnChange(event) {
    let val = this.validateInput(event.target.value);
    if (val === null) {
      val = this.props.defaultValue;
    }
    val = val * 2.83465;
    this.props.selectWidth({
      mainHandler: true,
      payloadMainHandler: {
        type: this.props.type,
        value: parseFloat(val)
      },
      keepDetailsWnd: true
    });
  }
  validateInput = value => {
    value = value.replace(",", ".");
    if (value.includes(".")) {
      let parts = value.split(".");
      if (parts.length !== 2) {
        return null;
      }
      if (
        isNaN(parts[0]) === true ||
        isNaN(parts[1]) === true ||
        parts[0] === ""
      ) {
        return null;
      }
      if (parts[0].length < 1 || parts[0].length > 2) return null;

      if (parts[1].length === 0) {
        parts[1] = "00";
      } else if (parts[1].length === 1) {
        parts[1] = parts[1] + "0";
      }
      return "" + parts[0] + "." + parts[1];
    } else {
      if (value.length > 2 || value.length < 1) {
        return null;
      } else {
        if (isNaN(value) === true) {
          return null;
        }
        const intValue = parseInt(value);
        if (intValue <= 0 || intValue > 99) {
          return null;
        }
        return "" + value + ".00";
      }
    }
  };

  componentDidUpdate() {
    if (this.input) {
      const $input = $(this.input.current);
      $input.val(this.checkUpdatedValue());
    }
  }
  componentWillUnmount() {
    if (this.input) {
      const $input = $(this.input.current);
      $input.off("blur");
      $input.off("keypress");
    }
  }
  render() {
    return (
      <div className="borderUnitCotainer">
        <input ref={this.input} type="text" min="0" max="10" />
        <span className={"unitBorder"}> {this.props.t("mm")}</span>
      </div>
    );
  }
}

module.exports = withNamespaces("translate")(UncontrolledInput);
