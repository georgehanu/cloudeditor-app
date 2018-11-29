const Html5Renderer = require("../../core/plugins/Html5Renderer");
const Fupa = require("../../core/plugins/Fupa").default;
const SideBar = require("../../core/plugins/SideBar");

const plugins = { Html5Renderer: Html5Renderer, Fupa, SideBar };

const requires = {};

module.exports = { plugins, requires };
