const React = require("react");

const Utils = require("../../../ToolbarConfig/utils");

const SpecialEffectsItem = props => {
  const className = Utils.MergeClassName(
    "SpecialEffectsImageBg",
    props.className
  );
  return (
    <React.Fragment>
      <div className="SpecialEffectsImageContainer">
        <img className={className} src={props.image} alt="" />
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
