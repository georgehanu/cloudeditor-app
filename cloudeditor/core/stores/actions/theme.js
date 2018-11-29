const actionTypes = require("../actionTypes/theme");

const changeTheme = theme => {
  return {
    type: actionTypes.CHANGE_THEME,
    theme
  };
};

module.exports = {
  changeTheme
};
