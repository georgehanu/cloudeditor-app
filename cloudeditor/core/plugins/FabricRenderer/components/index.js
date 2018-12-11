const assign = require("object-assign");
const Fabric = require("./Fabric");

FABRIC_NODES = [
  "Image",
  "Text",
  "IText",
  "Fabric",
  "Group",
  "Textbox",
  "Graphics",
  "Line",
  "TrimBox",
  "BleedBox",
  "Rect"
];

let TYPES = {};

FABRIC_NODES.forEach(function(nodeName) {
  TYPES[nodeName] = nodeName;
});

module.exports = assign(TYPES, { Fabric });
