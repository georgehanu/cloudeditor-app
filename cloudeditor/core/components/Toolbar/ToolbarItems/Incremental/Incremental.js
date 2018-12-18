const React = require("react");
const { withState, withHandlers, compose } = require("recompose");
const Button = require("../Button/Button");
const Utils = require("../../ToolbarConfig/utils");

const Incremental = props => {
  const parentClassName = Utils.MergeClassName(
    "Incremental",
    props.parentClassName
  );
  let value = props.value;
  if (props.value === null) {
    value = props.defaultValue;
  }
  return (
    <div className={parentClassName}>
      <input
        type="text"
        className="IncrementalText"
        onKeyPress={props.handleOnKeyPress}
        onChange={props.handleInputChanged}
        value={value}
      />
      <span className="IncrementalUnit">pt</span>
      <div className="IncrementalOp">
        <Button
          className="IncrementalAdd"
          clicked={() => props.handleIncrement(true)}
        >
          <span>+</span>
        </Button>
        <Button
          className="IncrementalSub"
          clicked={() => props.handleIncrement(false)}
        >
          <span>-</span>
        </Button>
      </div>
    </div>
  );
};

const validateInput = value => {
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

const increment = (value, operation) => {
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

const enhance = compose(
  withState("value", "setValue", null),
  withHandlers({
    handleInputChanged: props => event => {
      props.setValue(event.target.value);
    },
    handleOnKeyPress: props => event => {
      if (event.key === "Enter") {
        let val = validateInput(event.target.value);
        if (val === null) {
          val = props.defaultValue;
        }
        props.setValue(val);
        props.ToolbarHandler({
          mainHandler: true,
          payloadMainHandler: { type: props.type, value: val }
        });
      }
    },
    handleIncrement: props => opType => {
      let val = validateInput("" + props.value);
      if (props.value !== null) {
        val = validateInput("" + props.value);
      } else {
        val = props.defaultValue;
      }
      if (val === null) {
        val = props.defaultValue;
      } else {
        val = increment(val, opType);
      }
      props.setValue(val);

      props.ToolbarHandler({
        mainHandler: true,
        payloadMainHandler: { type: props.type, value: val }
      });
    }
  })
);
module.exports = enhance(Incremental);
