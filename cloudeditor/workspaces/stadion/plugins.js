const Html5Renderer = require("../../core/plugins/Html5Renderer");
const Fupa = require("../../plugins/Fupa/Fupa");
const SideBar = require("../../core/plugins/SideBar");
const AddImage = require("../../plugins/AddImage/AddImage");
const AddPdf = require("../../plugins/AddPdf/AddPdf");
const PageSelector = require("../../plugins/PageSelector/PageSelector");

const plugins = {
  Html5Renderer: Html5Renderer,
  SideBar: SideBar,
  Fupa: Fupa,
  AddImage: AddImage,
  AddPdf: AddPdf,
  PageSelector
};

const requires = {};

module.exports = { plugins, requires };
