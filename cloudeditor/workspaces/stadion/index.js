const { plugins, requires } = require("./plugins");
const localConfig = require("./localConfig.json");
require("../../main")(plugins, requires, localConfig);
require("./theme");
