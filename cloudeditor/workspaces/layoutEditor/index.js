const { merge } = require("ramda");
const { plugins, requires } = require("./plugins");
let localConfig = require("./localConfig.json");
const i18n = require("./i18n")(localConfig.translations);
localConfig = merge(localConfig, projectConfigGlobal || {});
require("../../main")(plugins, requires, localConfig, i18n);
require("./theme");
