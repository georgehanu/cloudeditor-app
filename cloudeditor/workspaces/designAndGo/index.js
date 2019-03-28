const { merge } = require("ramda");
let localConfig = require("./localConfig.json");
let localConfigDev = require("./localConfigDev.json");
const initialActions = require("./initialActions");

if (!PRODUCTION) {
  localConfig = merge(localConfig, localConfigDev);
}

const ConfigUtils = require("../../core/utils/ConfigUtils");

localConfig = merge(localConfig, projectConfigGlobal || {});
ConfigUtils.loadConfiguration(localConfig);

const { plugins, requires } = require("./plugins");

const translationsCfg = {
  baseUrl: localConfig.baseUrl,
  publicPath: localConfig.publicPath,
  basePath: localConfig.translations.basePath,
  lang: localConfig.translations.lang || "de-DE"
};

const i18n = require("../i18n")(translationsCfg);

require("../../main")(plugins, requires, localConfig, i18n, initialActions);
require("./theme");
