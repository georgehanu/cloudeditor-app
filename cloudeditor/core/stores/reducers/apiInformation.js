const { handleActions } = require("redux-actions");
const ProjectUtils = require("../../utils/ProjectUtils");
const ConfigUtils = require("../../utils/ConfigUtils");
const config = ConfigUtils.getDefaults();

const initialState = ProjectUtils.getEmptyApiInformation(config.apiInformation);

module.exports = handleActions({}, initialState);
