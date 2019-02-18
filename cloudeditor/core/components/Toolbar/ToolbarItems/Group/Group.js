const React = require("react");

const Utils = require("../../ToolbarConfig/utils");
const Types = require("../../ToolbarConfig/types");
const Config = require("../../ToolbarConfig/config");

const Button = require("../Button/Button");
const RefreshTableButton = require("../RefreshTableButton/RefreshTableButton");
const Poptext = require("../Poptext/Poptext");
const Slider = require("../Slider/Slider");
const Incremental = require("../Incremental/Incremental");
const ColorSelector = require("../ColorSelector/ColorSelector");
const InlineSlider = require("../InlineSlider/InlineSlider");
const SimpleIcon = require("../SimpleIcon/SimpleIcon");
const SimpleText = require("../SimpleText/SimpleText");

const Group = props => {
  const className = Utils.MergeClassName("GroupArea", props.className);
  /* Merge the props with the data from Config */
  const data = props.items.map(el => {
    return { ...Config[el.type], ...el };
  });

  const items = data.map((item, idx) => {
    if (item.baseType === Types.BUTTON) {
      return (
        <Button
          key={idx}
          className={item.parentClassName}
          selected={item.selected}
          tooltip={item.tooltip}
          clicked={() =>
            item.settingsHandler === undefined
              ? props.ToolbarHandler({
                  mainHandler: true,
                  payloadMainHandler: { type: item.type }
                })
              : props.ToolbarHandler({
                  mainHandler: true,
                  detailsWndComponent: item.settingsHandler,
                  payloadDetailsComponent: item.settingsPayload
                })
          }
        >
          <span className={item.className} />
        </Button>
      );
    } else if (item.baseType === Types.REFRESH_TABLE) {
      return (
        <RefreshTableButton
          key={idx}
          className={item.parentClassName}
          tooltip={item.tooltip}
          loading={item.refreshLoading}
          lastRefreshTime={item.lastRefreshTime}
          visible={item.visible}
          clicked={() =>
            item.settingsHandler === undefined
              ? props.ToolbarHandler({
                  mainHandler: true,
                  payloadMainHandler: { type: item.type }
                })
              : props.ToolbarHandler({
                  mainHandler: true,
                  detailsWndComponent: item.settingsHandler,
                  payloadDetailsComponent: item.settingsPayload
                })
          }
        >
          <span className={item.className} />
        </RefreshTableButton>
      );
    } else if (
      item.baseType === Types.POPTEXT_VALUE ||
      item.baseType === Types.POPTEXT_ICON
    )
      return (
        <Poptext {...item} key={idx} ToolbarHandler={props.ToolbarHandler} />
      );
    else if (item.baseType === Types.SLIDER)
      return (
        <Slider {...item} key={idx} ToolbarHandler={props.ToolbarHandler} />
      );
    else if (item.baseType === Types.INCREMENTAL)
      return (
        <Incremental
          {...item}
          key={idx}
          ToolbarHandler={props.ToolbarHandler}
        />
      );
    else if (item.baseType === Types.COLOR)
      return (
        <ColorSelector
          {...item}
          key={idx}
          ToolbarHandler={props.ToolbarHandler}
        />
      );
    else if (item.baseType === Types.SLIDER_INLINE)
      return (
        <InlineSlider
          {...item}
          key={idx}
          ToolbarHandler={props.ToolbarHandler}
        />
      );
    else if (item.baseType === Types.SIMPLE_ICON)
      return <SimpleIcon {...item} key={idx} />;
    else if (item.baseType === Types.SIMPLE_TEXT)
      return <SimpleText {...item} key={idx} />;
    return null;
  });

  return <div className={className}>{items}</div>;
};

module.exports = Group;
