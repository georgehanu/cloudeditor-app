const { shape, array, arrayOf } = require("prop-types");
const { merge } = require("ramda");

const { objectTypes, objectDefaults } = require("./object");

const activeSelectionTypes = arrayOf(
  shape(
    merge(objectTypes, {
      _objectsIds: array
    })
  )
).isRequired;

const activeSelectionDefaults = merge(objectDefaults, {
  type: "activeSelection",
  _objectsIds: []
});

module.exports = { activeSelectionTypes, activeSelectionDefaults };
