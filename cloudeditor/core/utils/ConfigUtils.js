const assign = require("object-assign");

let defaultConfig = {};

const ConfigUtils = {
  getDefaults: function() {
    return defaultConfig;
  },
  loadConfiguration: config => {
    defaultConfig = assign({}, defaultConfig, config);
    return defaultConfig;
  },
  getConfigProp: function(prop) {
    return defaultConfig[prop];
  },
  setConfigProp: function(prop, value) {
    defaultConfig[prop] = value;
  },
  removeConfigProp: function(prop) {
    delete defaultConfig[prop];
  },
  updateParent: function(templateId, isFooter, isHeader, shouldClose) {
    if (window.opener) {
      if (typeof window.opener.reloadProjects == "function") {
        if (isFooter) {
          window.opener.reloadProjectsCloueditorFooter(templateId);
        } else if (isHeader) {
          window.opener.reloadProjectsCloueditorHeader(templateId);
        } else {
          window.opener.reloadProjectsCloueditor(templateId);
        }
        if (shouldClose) window.close();
      }
    }
  }
};

module.exports = ConfigUtils;
