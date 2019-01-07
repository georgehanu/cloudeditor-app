const React = require("react");

const Config = require("../../ToolbarConfig/config");
const Types = require("../../ToolbarConfig/types");
const SpecialEffectsItem = require("./SpecialEffectsItem/SpecialEffectsItem");
const Button = require("../Button/Button");
const { withState, withHandlers, compose } = require("recompose");
const SpecialEffectsBrightnes = require("./SpecialEffectsBrightnes/SpecialEffectsBrightnes");

const SpecialEffectsWnd = props => {
  const SpecialEffectsData = [...Config[Types.SPECIAL_EFFECTS_WND].data];

  const items = SpecialEffectsData.map((el, index) => {
    return (
      <li key={index} className="SpecialEffectsGalleryItem">
        <SpecialEffectsItem
          image={props.itemData.image}
          text={el.text}
          className={el.className}
          value={el.value}
          handler={props.handler}
          ToolbarHandler={props.ToolbarHandler}
          settingsHandler={el.settingsHandler}
        />
      </li>
    );
  });

  let contentTab1 = null;
  let contentTab2 = null;
  if (props.activeTab === 2) {
    contentTab1 = (
      <ul className="SpecialEffectsGallery" style={{ display: "none" }}>
        {items}
      </ul>
    );
    contentTab2 = (
      <SpecialEffectsBrightnes
        visible="true"
        image={props.itemData.image}
        brightnessClass={props.itemData.brightnessClass}
        brightnessFilter={props.itemData.brightnessFilter}
        brightnessValue={props.itemData.brightnessValue}
        contrastValue={props.itemData.contrastValue}
        filter={props.itemData.filter}
        flip={props.itemData.flip}
        handler={props.handler}
        ToolbarHandler={props.ToolbarHandler}
      />
    );
  } else {
    contentTab1 = <ul className="SpecialEffectsGallery">{items}</ul>;
    contentTab2 = (
      <SpecialEffectsBrightnes
        visible="false"
        image={props.itemData.image}
        brightnessClass={props.itemData.brightnessClass}
        brightnessFilter={props.itemData.brightnessFilter}
        brightnessValue={props.itemData.brightnessValue}
        contrastValue={props.itemData.contrastValue}
        filter={props.itemData.filter}
        flip={props.itemData.flip}
        handler={props.handler}
        ToolbarHandler={props.ToolbarHandler}
      />
    );
  }

  return (
    <div className="SpecialEffectsContainer">
      <div className="SpecialEffectsLeft">
        <Button
          className="SpecialEffectsTab"
          clicked={() => props.setActiveTab(1)}
        >
          <span className="icon printqicon-effects" />
        </Button>
        <Button
          className="SpecialEffectsTab"
          clicked={() => props.setActiveTab(2)}
        >
          <span className="icon printqicon-brightness-contrast" />
        </Button>
      </div>
      <div className="SpecialEffectsContent">
        {contentTab1}
        {contentTab2}
      </div>
    </div>
  );
};

const enhance = compose(
  withState("activeTab", "setActiveTab", 1),
  withHandlers({
    handleClick: props => active => {
      props.setActiveTab(active);
    }
  })
);
module.exports = enhance(SpecialEffectsWnd);
