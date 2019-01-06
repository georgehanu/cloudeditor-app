const { shape, array, arrayOf } = require("prop-types");
const { merge } = require("ramda");

const { objectTypes, objectDefaults } = require("./object");

const graphicsTypes = arrayOf(
  shape(
    merge(objectTypes, {
      _objects: array
    })
  )
).isRequired;

const graphicsDefaults = merge(objectDefaults, {
  _objects: []
});

module.exports = { graphicsTypes, graphicsDefaults };
