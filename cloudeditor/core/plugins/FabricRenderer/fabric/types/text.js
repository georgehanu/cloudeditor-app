const {
  shape,
  number,
  string,
  oneOfType,
  oneOf,
  arrayOf
} = require("prop-types");
const { merge } = require("ramda");

const { objectTypes, objectDefaults } = require("./object");

const textTypes = arrayOf(
  shape(
    merge(objectTypes, {
      fontSize: number,
      fontWeight: oneOfType([number, string]),
      fontFamily: string,
      textDecoration: oneOf(["", "underline", "overline", "line-through"]),
      textAlign: oneOf(["left", "center", "right", "justify"]),
      fontStyle: oneOf(["", "normal", "italic", "oblique"]),
      lineHeight: number,
      textBackgroundColor: string
    })
  )
).isRequired;

const textDefaults = merge(objectDefaults, {
  type: "text",
  fontSize: 80,
  fontWeight: "normal",
  fontFamily: "Times New Roman",
  textDecoration: "",
  textAlign: "left",
  fontStyle: "",
  lineHeight: 1.16,
  textBackgroundColor: "",
  stroke: null,
  shadow: null,
  stateProperties: merge(objectDefaults.stateProperties, [
    "fontFamily",
    "fontWeight",
    "fontSize",
    "text",
    "textDecoration",
    "textAlign",
    "fontStyle",
    "lineHeight",
    "textBackgroundColor"
  ])
});

module.exports = { textTypes, textDefaults };
