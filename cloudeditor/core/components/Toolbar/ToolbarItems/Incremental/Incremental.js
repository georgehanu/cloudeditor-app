const React = require("react");
const Button = require("../Button/Button");
const Utils = require("../../ToolbarConfig/utils");
const $ = require("jquery");

class Incremental extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }
  shouldComponentUpdate(prevProps) {
    return prevProps.fontSize !== this.props.fontSize;
  }

  checkUpdatedValue() {
    let value = this.props.fontSize;
    if (value === null) {
      value = this.props.defaultValue;
    }

    if (("" + value).includes(".") === false) {
      value += ".00";
    }

    return parseFloat(value).toPrecision(3);
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
    const parentClassName = Utils.MergeClassName(
      "Incremental",
      this.props.parentClassName
    );

    return (
      <div className={parentClassName}>
        <input ref={this.input} type="text" className="IncrementalText" />
        <span className="IncrementalUnit">pt</span>
        <div className="IncrementalOp">
          <Button
            className="IncrementalAdd"
            clicked={() => this.handleIncrement(true, this.props.fontSize)}
          >
            <span>+</span>
          </Button>
          <Button
            className="IncrementalSub"
            clicked={() => this.handleIncrement(false, this.props.fontSize)}
          >
            <span>-</span>
          </Button>
        </div>
      </div>
    );
  }

  validateInput = value => {
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
      if (parts[0].length < 1 || parts[0].length > 2 || parts[1].length > 2)
        return null;

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

  increment = (value, operation) => {
    if (value.includes(".")) {
      let parts = value.split(".");
      if (isNaN(parts[0]) === true) {
        return null;
      }
      let intPart = parseInt(parts[0]);
      operation ? ++intPart : --intPart;
      if (intPart <= 0 || intPart === 100) {
        return value;
      }
      return "" + intPart + "." + parts[1];
    } else {
      if (isNaN(value) === true) {
        return null;
      }
      let intPart = parseInt(value);
      operation ? ++intPart : --intPart;
      if (intPart === 0 || intPart === 100) {
        return value;
      }
      return "" + intPart + ".00";
    }
  };

  updateOnChange(event) {
    let val = this.validateInput(event.target.value);
    if (val === null) {
      val = this.props.defaultValue;
    }
    this.props.ToolbarHandler({
      mainHandler: true,
      payloadMainHandler: { type: this.props.type, value: val }
    });
  }

  handleInputChanged = event => {
    //this.setstate({ value: event.target.value });
    this.updateOnChange(event);
  };
  handleOnKeyPress = event => {
    if (event.key === "Enter") {
      this.updateOnChange(event);
    }
  };

  handleIncrement = (opType, value) => {
    let val = this.validateInput("" + value);
    if (val !== null) {
      val = this.validateInput("" + value);
    } else {
      val = this.props.defaultValue;
    }
    if (val === null) {
      val = this.props.defaultValue;
    } else {
      val = this.increment(val, opType);
    }

    this.props.ToolbarHandler({
      mainHandler: true,
      payloadMainHandler: { type: this.props.type, value: val }
    });
  };

  onChangeHandler = event => {
    this.setState(this.setState({ fontSize: event.target.value }));
  };
}
module.exports = Incremental;
