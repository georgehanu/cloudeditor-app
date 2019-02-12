const axios = require("axios");
const ConfigUtils = require("../../../core/utils/ConfigUtils");

let instance = axios.create({
  baseURL: ConfigUtils.getConfigProp("baseUrl")
});

module.exports = instance;
