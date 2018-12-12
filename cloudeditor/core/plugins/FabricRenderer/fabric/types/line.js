const { shape, number, string, arrayOf } = require("prop-types");
const { merge } = require("ramda");

const { objectTypes, objectDefaults } = require("./object");

const lineTypes = arrayOf(
  shape(
    merge(objectTypes, {
      type: string
    })
  )
).isRequired;

const lineDefaults = merge(objectDefaults, {
  type: "line"
});

module.exports = { lineTypes, lineDefaults };
