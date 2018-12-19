const React = require("react");
const { withState, withHandlers, compose } = require("recompose");
const Button = require("../Button/Button");
const Utils = require("../../ToolbarConfig/utils");

class Incremental extends React.Component {
  render() {
    const parentClassName = Utils.MergeClassName(
      "Incremental",
      this.props.parentClassName
    );
    let value = this.props.fontSize;
    if (value === null) {
      value = this.props.defaultValue;
    }

    if (("" + value).includes(".") === false) {
      value += ".00";
    }

    return (
      <div className={parentClassName}>
        <input
          type="text"
          className="IncrementalText"
          onKeyPress={this.handleOnKeyPress}
          onChange={this.handleInputChanged}
          value={value}
        />
        <span className="IncrementalUnit">pt</span>
        <div className="IncrementalOp">
          <Button
            className="IncrementalAdd"
            clicked={() => this.handleIncrement(true, value)}
          >
            <span>+</span>
          </Button>
          <Button
            className="IncrementalSub"
            clicked={() => this.handleIncrement(false, value)}
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

  handleInputChanged = event => {
    //this.setstate({ value: event.target.value });
    this.props.ToolbarHandler({
      mainHandler: true,
      payloadMainHandler: { type: this.props.type, value: event.target.value }
    });
  };
  handleOnKeyPress = event => {
    if (event.key === "Enter") {
      let val = this.validateInput(event.target.value);
      if (val === null) {
        val = this.props.defaultValue;
      }
      this.props.ToolbarHandler({
        mainHandler: true,
        payloadMainHandler: { type: this.props.type, value: val }
      });
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
}
module.exports = Incremental;
