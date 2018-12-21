const { LAYOUTS_SELECT_IMAGE } = require("./actionTypes");

const { createActions } = require("redux-actions");

const { layoutsSelectImage } = createActions(LAYOUTS_SELECT_IMAGE);

module.exports = {
  layoutsSelectImage
};
