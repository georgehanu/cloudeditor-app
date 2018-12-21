const Html5Renderer = require("../../core/plugins/Html5Renderer");
const FabricRenderer = require("../../core/plugins/FabricRenderer");
const Toolbar = require("../../core/plugins/Toolbar");
const LiveHtml5Pagination = require("../../core/plugins/LiveHtml5Pagination/LiveHtml5Pagination");
const SideBar = require("../../core/plugins/Sidebar/Sidebar");
const AddImage = require("../../plugins/AddImage/AddImage");
const Zoom = require("../../plugins/Zoom/Zoom");
const AddPdf = require("../../plugins/AddPdf/AddPdf");

const plugins = {
  Html5Renderer,
  FabricRenderer,
  Toolbar,
  LiveHtml5Pagination,
  SideBar,
  AddImage,
  Zoom,
  AddPdf
};

const requires = {};

module.exports = { plugins, requires };
