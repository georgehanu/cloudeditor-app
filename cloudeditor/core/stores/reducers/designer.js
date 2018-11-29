const { append } = require("ramda");
const { REMOVE_ELEMENT } = require("../actionTypes/designer");
const ProjectUtils = require("../../utils/ProjectUtils");
const { handleActions } = require("redux-actions");

const emptyProject = ProjectUtils.getRandomProject();

const initialState = {
  ...emptyProject
};

module.exports = handleActions(
  {
    [REMOVE_ELEMENT]: (state, action) => {
      return { ...state };
    }
  },
  initialState
);
