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
  }
};

module.exports = ConfigUtils;
