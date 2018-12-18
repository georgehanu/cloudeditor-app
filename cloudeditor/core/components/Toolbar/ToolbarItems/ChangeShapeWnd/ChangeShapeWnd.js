const React = require("react");
const { withState, withHandlers, compose } = require("recompose");
const Button = require("../Button/Button");

const ChangeShapeWnd = props => {
  let slValue = props.sliderValue;
  if (props.sliderValue === null) {
    slValue = props.startValue;
  }

  return (
    <div className="ChangeShapeWnd">
      <div className="ChangeShapeImageContainer">
        <img src={props.image} className="ChangeShapeImage" />
      </div>
      <div className="ChangeShapeInvertThreshold">
        <span>Umkehren</span>
        <input type="checkbox" checked={props.selected} />
      </div>
      <div className="ChangeShapeSliderTitle">
        <span>Threshold</span>
      </div>
      <div className="ChangeShapeSlider">
        <input
          className="Slider"
          type="range"
          defaultValue={props.startValue}
          onMouseUp={event => props.handleSlider(event.target.value)}
          min="0"
          max="255"
          step="1"
        />
        <span className="SliderValue">{slValue}</span>
      </div>
      <div className="ChangeShapeButtons">
        <Button
          className="ChangeShapeClose"
          clicked={() => props.ToolbarHandler({})}
        >
          Schließen
        </Button>
        <Button className="ChangeShapeConfirm">Confirm</Button>
      </div>
    </div>
  );
};

const enhance = compose(
  withState("sliderValue", "setSliderValue", null),
  withHandlers({
    handleSlider: props => value => {
      props.setSliderValue(parseInt(value));
      //props.handler(value);
    }
    /*handleConfirm: props => value => {
            props.setSliderValue(parseInt(value))
            //props.handler(value);
        }*/
  })
);
module.exports = enhance(ChangeShapeWnd);
