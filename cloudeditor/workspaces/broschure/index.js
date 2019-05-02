const { merge } = require("ramda");
let localConfig = require("./localConfig.json");
let localConfigDev = require("./localConfigDev.json");

if (!PRODUCTION) {
  localConfig = merge(localConfig, localConfigDev);
}

const ConfigUtils = require("../../core/utils/ConfigUtils");

localConfig = merge(localConfig, projectConfigGlobal || {});
ConfigUtils.loadConfiguration(localConfig);

const { plugins, requires } = require("./plugins");

const appReducers = {
  project: require("../../core/stores/reducers/project"),
  ui: require("../../core/stores/reducers/ui"),
  assets: require("../../core/stores/reducers/assets"),
  variables: require("../../core/stores/reducers/variables"),
  selection: require("../../core/stores/reducers/selection"),
  productInformation: require("../../core/stores/reducers/productinformation"),
  layoutTemplate: require("../../core/stores/reducers/layout_template"),
  globalLoading: require("../../core/stores/reducers/globalLoading")
};

const projectEpics = require("../../core/stores/epics/project");
const assetsEpics = require("../../core/stores/epics/assets");
const appEpics = {
  ...projectEpics,
  ...assetsEpics
};

const translationsCfg = {
  baseUrl: localConfig.baseUrl,
  publicPath: localConfig.publicPath,
  basePath: localConfig.translations.basePath,
  lang: localConfig.translations.lang || "de-DE"
};

const i18n = require("../i18n")(translationsCfg);

require("../../main")(plugins, requires, appReducers, appEpics);
require("./theme");
