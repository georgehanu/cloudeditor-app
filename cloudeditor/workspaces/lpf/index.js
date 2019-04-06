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
  project: require("../../plugins/Lpf/Lpf/store/reducers/lpf"),
  productInformation: require("../../core/stores/reducers/productInformation"),
  globalLoading: require("../../core/stores/reducers/globalLoading")
};
const productInformationEpics = require("../../core/stores/epics/productInformation");
const apiEpics = require("../../core/stores/epics/api");
const appEpics = {
  ...productInformationEpics,
  ...apiEpics
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
