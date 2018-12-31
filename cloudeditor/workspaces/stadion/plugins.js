const Html5Renderer = require("../../core/plugins/Html5Renderer");
const Fupa = require("../../plugins/Fupa/Fupa");
const SideBar = require("../../core/plugins/Sidebar/Sidebar");
const AddImage = require("../../plugins/AddImage/AddImage");
const AddPdf = require("../../plugins/AddPdf/AddPdf");
const LiveHtml5Pagination = require("../../core/plugins/LiveHtml5Pagination/LiveHtml5Pagination");
const Layouts = require("../../plugins/Layouts/Layouts");
const Toolbar = require("../../core/plugins/Toolbar");
const Zoom = require("../../plugins/Zoom/Zoom");
const ProjectHeader = require("../../plugins/ProjectHeader/ProjectHeader");
const ProjectMenu = require("../../plugins/ProjectMenu/ProjectMenu");
const MenuItemMyProject = require("../../plugins/MenuItemMyProject/MenuItemMyProject");
const MenuItemPages = require("../../plugins/MenuItemPages/MenuItemPages");
const MenuItemTextImage = require("../../plugins/MenuItemTextImage/MenuItemTextImage");
const MenuItemUndoRedo = require("../../plugins/MenuItemUndoRedo/MenuItemUndoRedo");

const plugins = {
  Html5Renderer: Html5Renderer,
  SideBar: SideBar,
  Fupa: Fupa,
  AddImage: AddImage,
  AddPdf: AddPdf,
  LiveHtml5Pagination,
  Layouts,
  Zoom,
  Toolbar,
  ProjectHeader,
  ProjectMenu,
  MenuItemMyProject,
  MenuItemPages,
  MenuItemTextImage,
  MenuItemUndoRedo
};

const requires = {};

module.exports = { plugins, requires };
