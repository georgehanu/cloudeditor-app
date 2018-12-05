const React = require("react");

const Utils = require("../../ToolbarConfig/utils");
const { Config } = require("../../ToolbarConfig/config");
const Types = require("../../ToolbarConfig/types");

const SliderWnd = require("../Slider/SliderWnd/SliderWnd");
const ColorSelectorWnd = require("../ColorSelector/ColorElements/ColorSelectorWnd");
const SpecialEffectsWnd = require("../SpecialEffectsWnd/SpecialEffectsWnd");
const ChangeShapeWnd = require("../ChangeShapeWnd/ChangeShapeWnd");

const SettingsWnd = props => {
  /* Merge the props with the data from Config */
  console.log(props);
  const item = { ...props.payload, ...Config[props.item] }; // second should be config
  let itemData = null;

  if (item.baseType === Types.COLOR_SELECTOR_WND)
    itemData = (
      <ColorSelectorWnd
        {...item}
        ToolbarHandler={props.ToolbarHandler}
        handler={props.handler}
        itemData={props.itemData}
      />
    );
  else if (item.baseType === Types.SLIDER_WND)
    itemData = (
      <SliderWnd
        {...item}
        ToolbarHandler={props.ToolbarHandler}
        handler={props.handler}
        {...props.itemData}
      />
    );
  else if (item.baseType === Types.SPECIAL_EFFECTS_WND)
    itemData = (
      <SpecialEffectsWnd
        {...item}
        ToolbarHandler={props.ToolbarHandler}
        handler={props.handler}
        itemData={props.itemData}
      />
    );
  else if (item.baseType === Types.CHANGE_SHAPE_WND)
    itemData = (
      <ChangeShapeWnd
        {...item}
        ToolbarHandler={props.ToolbarHandler}
        handler={props.handler}
        {...props.itemData}
      />
    );

  return <div className="SettingsWnd">{itemData}</div>;
};

module.exports = SettingsWnd;
