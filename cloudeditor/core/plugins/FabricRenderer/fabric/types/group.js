const { shape, array, arrayOf } = require("prop-types");
const { merge } = require("ramda");

const { objectTypes, objectDefaults } = require("./object");

const groupTypes = arrayOf(
  shape(
    merge(objectTypes, {
      _objects: array
    })
  )
).isRequired;

const groupDefaults = merge(objectDefaults, {
  _objects: []
});

module.exports = { groupTypes, groupDefaults };
