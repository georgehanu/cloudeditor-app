const { merge } = require("ramda");
let localConfig = require("./localConfig.json");
const ConfigUtils = require("../../core/utils/ConfigUtils");

localConfig = merge(localConfig, projectConfigGlobal || {});
ConfigUtils.loadConfiguration(localConfig);

const { plugins, requires } = require("./plugins");

const translationsCfg = {
  baseUrl: localConfig.baseUrl,
  publicPath: localConfig.publicPath,
  basePath: localConfig.translations.basePath
};

const i18n = require("../i18n")(translationsCfg);

require("../../main")(plugins, requires, i18n);
require("./theme");
