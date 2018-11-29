const actionTypes = require("../actionTypes/tabBar");

const toogleTabBar = () => {
  return {
    type: actionTypes.TOOGLE_TABBAR
  };
};

module.exports = {
  toogleTabBar
};
