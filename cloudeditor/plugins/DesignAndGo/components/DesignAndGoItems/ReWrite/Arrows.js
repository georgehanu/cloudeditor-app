let Arrows = require("react-slick/lib/arrows.js");

Arrows.PrevArrow.prototype.clickHandler = function clickHandler(options, e) {
  if (e) {
    e.preventDefault();
  }
  let returnValue = window.changeSlider(true, false);
  if (returnValue) {
    this.forceUpdate();
    this.props.clickHandler(options, e);
    setTimeout(() => {
      window.changeSlider(false, undefined);
      this.forceUpdate();
    }, 500);
  }
};

Arrows.NextArrow.prototype.clickHandler = function clickHandler(options, e) {
  if (e) {
    e.preventDefault();
  }
  let returnValue = window.changeSlider(true, true);
  if (returnValue) {
    this.forceUpdate();
    this.props.clickHandler(options, e);
    setTimeout(() => {
      window.changeSlider(false, undefined);
      this.forceUpdate();
    }, 500);
  }
};

module.exports = Arrows;
