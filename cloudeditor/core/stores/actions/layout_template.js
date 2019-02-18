const {
  UPDATE_LAYOUT_TEMPLATE,
  SAVE_LAYOUT_TEMPLATE_START,
  SAVE_LAYOUT_TEMPLATE_FAILED,
  SAVE_LAYOUT_TEMPLATE_SUCCESS,
  SAVE_ICON_TEMPLATE_START,
  SAVE_ICON_TEMPLATE_FAILED,
  SAVE_ICON_TEMPLATE_SUCCESS
} = require("../actionTypes/layout_template");

const { createActions } = require("redux-actions");

const {
  updateLayoutTemplate,
  saveLayoutTemplateStart,
  saveLayoutTemplateFailed,
  saveLayoutTemplateSuccess,
  saveIconTemplateStart,
  saveIconTemplateFailed,
  saveIconTemplateSuccess
} = createActions(
  UPDATE_LAYOUT_TEMPLATE,
  SAVE_LAYOUT_TEMPLATE_START,
  SAVE_LAYOUT_TEMPLATE_FAILED,
  SAVE_LAYOUT_TEMPLATE_SUCCESS,
  SAVE_ICON_TEMPLATE_START,
  SAVE_ICON_TEMPLATE_FAILED,
  SAVE_ICON_TEMPLATE_SUCCESS
);

module.exports = {
  updateLayoutTemplate,
  saveLayoutTemplateStart,
  saveLayoutTemplateFailed,
  saveLayoutTemplateSuccess,
  saveIconTemplateStart,
  saveIconTemplateFailed,
  saveIconTemplateSuccess
};
