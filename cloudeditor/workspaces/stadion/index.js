const { plugins, requires } = require("./plugins");
const localConfig = require("./localConfig.json");
const i18n = require("./i18n");
require("../../main")(plugins, requires, localConfig, i18n);
require("./theme");
