const Html5Renderer = require("../../core/plugins/Html5Renderer");
const Toolbar = require("../../core/plugins/Toolbar");
const LiveHtml5Pagination = require("../../core/plugins/LiveHtml5Pagination/LiveHtml5Pagination");
const SideBar = require("../../core/plugins/Sidebar/Sidebar");
const AddImage = require("../../plugins/AddImage/AddImage");
const Zoom = require("../../plugins/Zoom/Zoom");
const AddPdf = require("../../plugins/AddPdf/AddPdf");
const Fupa = require("../../plugins/Fupa/Fupa");

const plugins = {
  Html5Renderer,
  Toolbar,
  LiveHtml5Pagination,
  SideBar,
  AddImage,
  Zoom,
  AddPdf,
  Fupa
};

const requires = {};

module.exports = { plugins, requires };
