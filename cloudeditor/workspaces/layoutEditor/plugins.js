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
const MenuItemHeaderFooter = require("../../plugins/MenuItemHeaderFooter/MenuItemHeaderFooter");
const ProjectMenu = require("../../plugins/ProjectMenu/ProjectMenu");
const MenuItemTextImage = require("../../plugins/MenuItemTextImage/MenuItemTextImage");
const MenuItemUndoRedo = require("../../plugins/MenuItemUndoRedo/MenuItemUndoRedo");
const MenuItemTable = require("../../plugins/MenuItemTable/MenuItemTable");
const HelperLines = require("../../plugins/HelperLines/HelperLines");

const plugins = {
  Html5Renderer: Html5Renderer,
  Fupa,
  SideBar: SideBar,
  AddImage: AddImage,
  AddPdf: AddPdf,
  Layouts,
  Toolbar,
  MenuItemHeaderFooter,
  LayoutEditorHeader,
  Zoom,
  Background,
  GraphicElements,
  ProjectMenu,
  MenuItemTextImage,
  MenuItemUndoRedo,
  MenuItemTable,
  HelperLines
};

const requires = {};

module.exports = { plugins, requires };
