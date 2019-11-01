const { plugins, requires } = require("./plugins");
let localConfig = require("./localConfig.json");
const { merge } = require("ramda");
//merge with global var

localConfig = merge(localConfig, projectConfigGlobal);
console.log(localConfig, "local config");
require("./i18n");
require("../../main")(plugins, requires, localConfig
);
require("./theme");
