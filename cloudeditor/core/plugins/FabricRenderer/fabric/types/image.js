const { shape, number, arrayOf, string } = require("prop-types");
const { merge } = require("ramda");

const { objectTypes, objectDefaults } = require("./object");

const imageTypes = arrayOf(
  shape(
    merge(objectTypes, {
      type: string,
      fitMethod: string,
      cropX: number,
      cropY: number,
      cropW: number,
      cropH: number,
      ratio: number,
      brightness: number,
      contrast: number,
      leftSlider: number,
      imageWidth: number,
      imageHeight: number
    })
  )
).isRequired;

const imageDefaults = merge(objectDefaults, {
  type: "image",
  fitMethod: "cover",
  cropX: 0,
  cropY: 0,
  cropW: 0,
  cropH: 0,
  ratio: 0,
  brightness: 0,
  contrast: 0,
  leftSlider: 0,
  imageWidth: 0,
  imageHeight: 0
});

module.exports = { imageTypes, imageDefaults };
