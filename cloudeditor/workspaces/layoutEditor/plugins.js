const Html5Renderer = require("../../core/plugins/Html5Renderer");
const Fupa = require("../../plugins/Fupa/Fupa");
const SideBar = require("../../core/plugins/Sidebar/Sidebar");
const AddImage = require("../../plugins/AddImage/AddImage");
const AddPdf = require("../../plugins/AddPdf/AddPdf");
const Layouts = require("../../plugins/Layouts/Layouts");
const Toolbar = require("../../core/plugins/Toolbar");
const Zoom = require("../../plugins/Zoom/Zoom");
const Background = require("../../plugins/Background/Background");
const GraphicElements = require("../../plugins/GraphicElements/GraphicElements");
const LayoutEditorHeader = require("../../plugins/LayoutEditorHeader/LayoutEditorHeader");

const plugins = {
  Html5Renderer: Html5Renderer,
  Fupa,
  SideBar: SideBar,
  AddImage: AddImage,
  AddPdf: AddPdf,
  Layouts,
  Toolbar,
  Zoom,
  LayoutEditorHeader,
  Background,
  GraphicElements
};

const requires = {};

module.exports = { plugins, requires };
