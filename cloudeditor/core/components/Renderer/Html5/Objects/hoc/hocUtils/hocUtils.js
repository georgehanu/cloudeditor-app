const $ = require("jquery");
const { merge } = require("ramda");

const addSnapElements = (event, ui, snapElements, handler) => {
  $(".drag_alignLines:visible").toggleClass("snaped", false);
  snapElements.forEach(element => {
    ui = merge(ui, {
      snapElement: $(element.item),
      snapping: element.snapping
    });
    if (element.snapping) {
      handler._trigger("snapped", event, ui);
    }
  });
  return ui;
};
const removeSnapClass = () => {
  $(".drag_alignLines:visible").toggleClass("snaped", false);
};
module.exports = {
  addSnapElements,
  removeSnapClass
};
