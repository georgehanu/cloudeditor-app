const {
  CHANGE_PROJECT_TITLE,
  ADD_OBJECT,
  ADD_OBJECT_TO_PAGE,
  ADD_OBJECT_ID_TO_SELECTED,
  ADD_OBJECT_ID_ACTION_SELECTED,
  REMOVE_SELECTION,
  REMOVE_ACTION_SELECTION,
  UPDATE_SELECTION_OBJECTS_COORDS,
  UPDATE_OBJECT_PROPS,
  CHANGE_PAGE,
  CHANGE_GROUPS,
  UPDATE_CROP_PARAMS,
  ON_TEXT_CHANGE,
  CHANGE_RANDOM_PAGE,
  CHANGE_PAGES_ORDER
} = require("../actionTypes/project");
const { createActions } = require("redux-actions");

const {
  changeProjectTitle,
  addObject,
  addObjectToPage,
  addObjectIdToSelected,
  addObjectIdActionSelected,
  removeSelection,
  removeActionSelection,
  updateSelectionObjectsCoords,
  updateObjectProps,
  changePage,
  updateCropParams,
  changeGroups,
  onTextChange,
  changeRandomPage,
  changePagesOrder
} = createActions(
  CHANGE_PROJECT_TITLE,
  ADD_OBJECT,
  ADD_OBJECT_TO_PAGE,
  ADD_OBJECT_ID_TO_SELECTED,
  ADD_OBJECT_ID_ACTION_SELECTED,
  REMOVE_SELECTION,
  REMOVE_ACTION_SELECTION,
  UPDATE_SELECTION_OBJECTS_COORDS,
  UPDATE_OBJECT_PROPS,
  CHANGE_PAGE,
  UPDATE_CROP_PARAMS,
  CHANGE_GROUPS,
  ON_TEXT_CHANGE,
  CHANGE_RANDOM_PAGE,
  CHANGE_PAGES_ORDER
);

module.exports = {
  changeProjectTitle,
  addObject,
  addObjectToPage,
  addObjectIdToSelected,
  addObjectIdActionSelected,
  removeSelection,
  removeActionSelection,
  updateSelectionObjectsCoords,
  updateObjectProps,
  changePage,
  updateCropParams,
  changeGroups,
  onTextChange,
  changeRandomPage,
  changePagesOrder
};
