const FabricRenderer = require("../../core/plugins/FabricRenderer");
const DesignAndGo = require("../../plugins/DesignAndGo/DesignAndGo");
const DGPrintPreview = require("../../plugins/DesignAndGo/plugins/PrintPreview/PrintPreview");

const plugins = { FabricRenderer, DesignAndGo, DGPrintPreview };

const requires = {};

module.exports = { plugins, requires };
