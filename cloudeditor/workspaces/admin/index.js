const { plugins, requires } = require("./plugins");
const localConfig = require("./localConfig.json");
require("./i18n");
require("../../main")(plugins, requires, localConfig);
require("./theme");
