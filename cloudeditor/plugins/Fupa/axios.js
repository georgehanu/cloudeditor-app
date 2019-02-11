const axios = require("axios");
const ConfigUtils = require("../../core/utils/ConfigUtils");

const instance = axios.create({
  baseURL: ConfigUtils.getConfigProp("baseUrl") + "fupa/"
});

module.exports = instance;
