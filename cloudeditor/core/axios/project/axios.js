const axios = require("axios");
const ConfigUtils = require("../../../core/utils/ConfigUtils");

let instance = axios.create({
  baseURL: ConfigUtils.getConfigProp("baseUrl"),
  headers: {
    "X-CSRF-TOKEN": document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content")
  }
});

module.exports = instance;
