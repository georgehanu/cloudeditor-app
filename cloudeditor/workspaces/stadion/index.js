const { plugins, requires } = require("./plugins");
let localConfig = require("./localConfig.json");
const i18n = require("./i18n");
const { merge } = require("ramda");
//merge with global var

localConfig = merge(localConfig, projectConfigGlobal);
require("../../main")(plugins, requires, localConfig, i18n);
require("./theme");
