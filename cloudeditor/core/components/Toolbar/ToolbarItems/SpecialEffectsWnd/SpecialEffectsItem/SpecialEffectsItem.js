const React = require("react");

const Utils = require("../../../ToolbarConfig/utils");
const ConfigUtils = require("../../../../../../core/utils/ConfigUtils");
const baseUrl =
  ConfigUtils.getConfigProp("baseUrl") + "/media/personalization/";
const SpecialEffectsItem = props => {
  const className = Utils.MergeClassName(
    "SpecialEffectsImageBg",
    props.className
  );
  return (
    <React.Fragment>
      <div className="SpecialEffectsImageContainer">
        <img className={className} src={baseUrl + props.image} alt="" />
        <div className="SpecialEffectsActions">
          <span
            className="SpecialEffectsOK pic select icon printqicon-ok"
            onClick={() => {
              props.ToolbarHandler({
                mainHandler: true,
                payloadMainHandler: {
                  value: props.value,
                  type: props.settingsHandler
                }
              });
            }}
          />
        </div>
      </div>
      <span className="SpecialEffectsImageText">{props.text}</span>
    </React.Fragment>
  );
};

module.exports = SpecialEffectsItem;
