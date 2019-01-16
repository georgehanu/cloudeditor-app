const actionTypes = require("../actionTypes/tabBar");
const { updateObject } = require("../../utils/UtilUtils");

const toogleTabBar = state => {
  return updateObject(state, { expanded: !state.expanded });
};

const initialState = {
  expanded: false
};

const tabBar = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOOGLE_TABBAR:
      return toogleTabBar(state, action);
    default:
      return state;
  }
};

module.exports = tabBar;
