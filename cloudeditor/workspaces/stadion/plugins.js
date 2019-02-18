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
const MenuItemManual = require("../../plugins/MenuItemManual/MenuItemManual");
const MenuItemCancel = require("../../plugins/MenuItemCancel/MenuItemCancel");
const MenuItemHeaderFooter = require("../../plugins/MenuItemHeaderFooter/MenuItemHeaderFooter");
const HelperLines = require("../../plugins/HelperLines/HelperLines");
const PrintPreview = require("../../plugins/PrintPreview/PrintPreview");
const Background = require("../../plugins/Background/Background");
//const Content = require("../../plugins/Content/Content");
//const Advertising = require("../../plugins/Advertising/Advertising");
//const Asistent = require("../../plugins/Asistent/Asistent");
const GraphicElements = require("../../plugins/GraphicElements/GraphicElements");
const Settings = require("../../plugins/Settings/Settings");
const MenuItemTable = require("../../plugins/MenuItemTable/MenuItemTable");

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
  MenuItemUndoRedo,
  MenuItemHeaderFooter,
  MenuItemManual,
  MenuItemCancel,
  HelperLines,
  PrintPreview,
  Background,
  //Content,
  //Advertising,
  //Asistent,
  GraphicElements,
  Settings,
  MenuItemTable
};

const requires = {};

module.exports = { plugins, requires };
