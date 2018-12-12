const { shape, arrayOf } = require("prop-types");
const { merge } = require("ramda");

const { textTypes, textDefaults } = require("./text");

const ITextTypes = arrayOf(shape(merge(textTypes, {}))).isRequired;

const ITextDefaults = merge(textDefaults, {
  type: "itext",
  fontSize: 120
});

module.exports = { ITextTypes, ITextDefaults };
