const Html5Renderer = require("../../core/plugins/Html5Renderer");
const Toolbar = require("../../core/plugins/Toolbar");
const LiveHtml5Pagination = require("../../core/plugins/LiveHtml5Pagination/LiveHtml5Pagination");

const plugins = {
  Html5Renderer,
  Toolbar,
  LiveHtml5Pagination
};

const requires = {};

module.exports = { plugins, requires };
