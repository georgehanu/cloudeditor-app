const { handleActions } = require("redux-actions");
const ProjectUtils = require("../../utils/ProjectUtils");
const ConfigUtils = require("../../utils/ConfigUtils");
const config = ConfigUtils.getDefaults();

/* To work local */
const initialState = ProjectUtils.getEmptySelection(config.selection);
module.exports = handleActions({}, initialState);
