const Html5Renderer = require("../../core/plugins/Html5Renderer");
const Toolbar = require("../../core/plugins/Toolbar");
const LiveHtml5Pagination = require("../../core/plugins/LiveHtml5Pagination/LiveHtml5Pagination");
const SideBar = require("../../core/plugins/Sidebar/Sidebar");
const AddImage = require("../../plugins/AddImage/AddImage");
const Zoom = require("../../plugins/Zoom/Zoom");
const AddPdf = require("../../plugins/AddPdf/AddPdf");
const Fupa = require("../../plugins/Fupa/Fupa");
const ProjectHeader = require("../../plugins/ProjectHeader/ProjectHeader");
const ProjectMenu = require("../../plugins/ProjectMenu/ProjectMenu");
const MenuItemMyProject = require("../../plugins/MenuItemMyProject/MenuItemMyProject");
const MenuItemPages = require("../../plugins/MenuItemPages/MenuItemPages");
const MenuItemTextImage = require("../../plugins/MenuItemTextImage/MenuItemTextImage");
const Layouts = require("../../plugins/Layouts/Layouts");

const plugins = {
  Html5Renderer,
  Toolbar,
  LiveHtml5Pagination,
  SideBar,
  AddImage,
  Zoom,
  AddPdf,
  Fupa,
  ProjectHeader,
  ProjectMenu,
  MenuItemMyProject,
  MenuItemPages,
  MenuItemTextImage,
  Layouts
};

const requires = {};

module.exports = { plugins, requires };
