const React = require("react");
const { withState, withHandlers, compose, pure } = require("recompose");
const Button = require("../Button/Button");

const Utils = require("../../ToolbarConfig/utils");
const Types = require("../../ToolbarConfig/types");
const Operation = require("../../ToolbarConfig/operation");

const Poptext = props => {
  let icons = null;
  let value = null;
  let dropDown = null;
  let data = props.data;

  if (props.newData && props.operation) {
    if (props.operation === Operation.MERGE_DATA) {
      data = [...props.data];
      for (let item in props.newData) {
        const index = data.findIndex(el => {
          return el.value === props.newData[item].value;
        });
        if (index === -1) {
          data.push(props.newData[item]);
        } else {
          data[index] = { ...data[index], ...props.newData[item] };
        }
      }
    } else if (props.operation === Operation.NEW_DATA) {
      data = props.newData;
    }
  }

  if (props.baseType === Types.POPTEXT_ICON) {
    icons = data.map((el, index) => {
      return (
        <li
          key={index}
          className={
            el.className + " ItemList " + (el.disabled ? "disabled" : "")
          }
          onClick={() =>
            el.disabled
              ? null
              : el.settingsHandler === undefined
              ? props.handleClick(el.value)
              : props.handleSettingsClick({
                  mainHandler: true,
                  detailsWndComponent: el.settingsHandler,
                  payloadDetailsComponent: el.settingsPayload
                })
          }
        >
          <span className="BorderBottom" />
        </li>
      );
    });

    value = <span className={props.className} />;
    if (props.selected) {
      const index = data.findIndex(el => {
        return el.value === props.selected;
      });
      if (index >= 0) {
        value = <span className={data[index].className} />;
      }
    }
  } else if (props.baseType === Types.POPTEXT_VALUE) {
    icons = data.map((el, index) => {
      return (
        <li
          key={index}
          style={{ fontFamily: el.fontFamily }}
          className={el.className + " ItemList"}
          onClick={() => props.handleClick(el.value)}
        >
          {el.label}
          <span className="BorderBottom" />
        </li>
      );
    });

    value = <span className="PoptextValueText">{props.value}</span>;
  }
  if (props.dropDown) {
    dropDown = <span className={props.dropDown} />;
  }

  const ulClass = Utils.MergeClassName(
    props.expanded ? "ShowList" : "HideList",
    props.poptextClassName
  );
  const parentClassName = Utils.MergeClassName(
    "Poptext",
    props.parentClassName
  );

  return (
    <div className={parentClassName}>
      <Button clicked={() => props.handleButtonClick(!props.expanded)}>
        {value}
        {dropDown}
      </Button>

      <ul className={ulClass} onMouseLeave={() => props.handleMouseLeave()}>
        {icons}
      </ul>
    </div>
  );
};

const enhance = compose(
  withState("expanded", "setExpanded", false),
  withHandlers({
    handleClick: props => event => {
      props.setExpanded(!props.expanded);
      //props.handler(event);
      props.ToolbarHandler({
        mainHandler: true,
        payloadMainHandler: { type: props.type, value: event }
      });
    },
    handleMouseLeave: props => event => {
      props.setExpanded(false);
    },
    handleButtonClick: props => event => {
      props.setExpanded(!props.expanded);
      props.ToolbarHandler({});
    },
    handleSettingsClick: props => payload => {
      props.setExpanded(false);
      props.ToolbarHandler(payload);
    }
  }),
  pure
);
module.exports = enhance(Poptext);
