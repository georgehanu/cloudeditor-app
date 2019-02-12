const Html5Renderer = require("../../core/plugins/Html5Renderer");
const SideBar = require("../../core/plugins/Sidebar/Sidebar");
const AddImage = require("../../plugins/AddImage/AddImage");
const AddPdf = require("../../plugins/AddPdf/AddPdf");
const Layouts = require("../../plugins/Layouts/Layouts");
const Toolbar = require("../../core/plugins/Toolbar");
const LayoutEditorHeader = require("../../plugins/LayoutEditorHeader/LayoutEditorHeader");
const MenuItemHeaderFooter = require("../../plugins/MenuItemHeaderFooter/MenuItemHeaderFooter");

const plugins = {
  Html5Renderer: Html5Renderer,
  SideBar: SideBar,
  AddImage: AddImage,
  AddPdf: AddPdf,
  Layouts,
  Toolbar,
  MenuItemHeaderFooter,
  LayoutEditorHeader
};

const requires = {};

module.exports = { plugins, requires };
