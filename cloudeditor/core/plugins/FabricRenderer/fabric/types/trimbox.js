const { shape, number, string, bool, arrayOf } = require("prop-types");
const { merge } = require("ramda");

const { lineTypes, lineDefaults } = require("./line");

const trimBoxTypes = arrayOf(
  shape(
    merge(lineTypes, {
      stroke: string,
      strokeWidth: number,
      evented: bool,
      selectable: bool
    })
  )
).isRequired;

const trimBoxDefaults = merge(lineDefaults, {
  stroke: "rgb(0,0,0)",
  strokeWidth: 0,
  evented: false,
  selectable: false
});

module.exports = { trimBoxTypes, trimBoxDefaults };
