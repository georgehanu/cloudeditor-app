const uuidv4 = require("uuid/v4");
const { handleActions } = require("redux-actions");
const { pathOr } = require("ramda");

const ProjectUtils = require("../../utils/ProjectUtils");
const ConfigUtils = require("../../utils/ConfigUtils");
const config = ConfigUtils.getDefaults();

const initialState = ProjectUtils.getEmptyLayoutTemplateConfig(
  config.layoutTemplateCnfg
);
module.exports = handleActions({}, initialState);
