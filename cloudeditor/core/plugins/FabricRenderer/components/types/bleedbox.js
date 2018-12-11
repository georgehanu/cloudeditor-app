const { shape, number, string, bool, arrayOf } = require("prop-types");
const { merge } = require("ramda");

const { lineTypes, lineDefaults } = require("./line");

const bleedBoxTypes = arrayOf(
  shape(
    merge(lineTypes, {
      stroke: string,
      strokeWidth: number,
      evented: bool,
      selectable: bool
    })
  )
).isRequired;

const bleedBoxDefaults = merge(lineDefaults, {
  stroke: "rgb(255,0,0)",
  strokeWidth: 1,
  evented: false,
  selectable: false
});

module.exports = { bleedBoxTypes, bleedBoxDefaults };
