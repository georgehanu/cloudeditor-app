const { shape, number, string, arrayOf } = require("prop-types");
const { merge } = require("ramda");

const { objectTypes, objectDefaults } = require("./object");

const rectTypes = arrayOf(
  shape(
    merge(objectTypes, {
      rx: number,
      ry: number,
      type: string
    })
  )
).isRequired;

const rectDefaults = merge(objectDefaults, {
  rx: 0,
  ry: 0,
  type: "rect"
});

module.exports = { rectTypes, rectDefaults };
