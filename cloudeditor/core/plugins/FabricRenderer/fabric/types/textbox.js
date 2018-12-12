const { shape, arrayOf } = require("prop-types");
const { merge } = require("ramda");

const { textTypes, textDefaults } = require("./text");

const TextboxTypes = arrayOf(shape(merge(textTypes, {}))).isRequired;

const TextboxDefaults = merge(textDefaults, {
  type: "textbox",
  fontSize: 120
});

module.exports = { TextboxTypes, TextboxDefaults };
