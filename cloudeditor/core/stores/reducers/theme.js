const actionTypes = require("../actionTypes/theme");
const { updateObject } = require("../../utils/UtilUtils");

const changeTheme = (state, action) => {
  return updateObject(state, { theme: action.theme });
};

const initialState = { theme: "base" };

const theme = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_THEME:
      return changeTheme(state, action);
    default:
      return state;
  }
};

module.exports = theme;
