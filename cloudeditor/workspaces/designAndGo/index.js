const { merge } = require("ramda");
const { plugins, requires } = require("./plugins");
let localConfig = require("./localConfig.json");
const initialActions = require("./initialActions");

console.log("PRODUCTION", PRODUCTION);
if (!PRODUCTION) {
  localConfig.translations.baseUrl = "http://localhost:8081/";
  localConfig.translations.publicPath = "";

  localConfig.baseUrl = "http://localhost:8081/";
  localConfig.publicPath = "";
}

const i18n = require("./i18n")(localConfig.translations);

localConfig = merge(localConfig, projectConfigGlobal || {});
require("../../main")(plugins, requires, localConfig, i18n, initialActions);
require("./theme");
