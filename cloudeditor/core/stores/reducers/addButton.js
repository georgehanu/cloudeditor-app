const { ADD_IMAGE_FROM_BUTTON } = require("../actionTypes/addButton");

const { handleActions } = require("redux-actions");

const initialState = {};

module.exports = handleActions(
  {
    [ADD_IMAGE_FROM_BUTTON]: (state, action) => {
      console.log("called from epic", action);
      return state;
    }
  },
  initialState
);
