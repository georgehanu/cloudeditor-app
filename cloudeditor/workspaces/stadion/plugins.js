const Html5Renderer = require("../../core/plugins/Html5Renderer");
const Fupa = require("../../plugins/Fupa/Fupa");
const SideBar = require("../../core/plugins/SideBar");

const plugins = { Html5Renderer: Html5Renderer, SideBar, Fupa };

const requires = {};

module.exports = { plugins, requires };
