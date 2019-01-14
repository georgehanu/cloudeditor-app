const {
  CHANGE_PROJECT_TITLE,
  ADD_OBJECT_TO_PAGE,
  ADD_OBJECT_ID_TO_SELECTED,
  ADD_OBJECT_ID_ACTION_SELECTED,
  REMOVE_SELECTION,
  REMOVE_ACTION_SELECTION,
  UPDATE_SELECTION_OBJECTS_COORDS,
  UPDATE_OBJECT_PROPS,
  UPDATE_OBJECT_PROPS_NO_UNDO_REDO,
  CHANGE_PAGE,
  CHANGE_GROUPS,
  UPDATE_CROP_PARAMS,
  ON_TEXT_CHANGE,
  CHANGE_RANDOM_PAGE,
  CHANGE_PAGES_ORDER,
  ADD_PAGES,
  ADD_OBJECT,
  ADD_TABLE,
  DELETE_OBJ,
  ADD_OBJECT_MIDDLE,
  DELETE_PAGE,
  UPDATE_HEADERCONFIG_PROPS,
  CHANGE_MODE_HEADER_FOOTER,
  UPDATE_FOOTERCONFIG_PROPS,
  RESTORE_PAGES,
  PROJ_SAVE_START,
  PROJ_SAVE_SUCCESS,
  PROJ_SAVE_FAILED,
  PROJ_SAVE_CLEAR_MESSAGE,
  PROJ_LOAD_START,
  PROJ_LOAD_SUCCESS,
  PROJ_LOAD_FAILED,
  PROJ_LOAD_CLEAR_MESSAGE,
  PROJ_LOAD_DELETE_START,
  PROJ_LOAD_DELETE_SUCCESS,
  PROJ_LOAD_DELETE_FAILED,
  PROJ_LOAD_DELETE_CLEAR_MESSAGE,
  PROJ_LOAD_PROJECT_START,
  PROJ_LOAD_PROJECT_SUCCESS,
  PROJ_LOAD_PROJECT_FAILED,
  PROJ_LOAD_PROJECT_CLEAR_MESSAGE
} = require("../actionTypes/project");
const { createActions } = require("redux-actions");

const {
  changeProjectTitle,
  addObjectToPage,
  addObjectIdToSelected,
  addObjectIdActionSelected,
  removeSelection,
  removeActionSelection,
  updateSelectionObjectsCoords,
  updateObjectProps,
  updateObjectPropsNoUndoRedo,
  changePage,
  updateCropParams,
  changeGroups,
  onTextChange,
  changeRandomPage,
  changePagesOrder,
  addPages,
  addObject,
  addTable,
  deleteObj,
  addObjectMiddle,
  deletePage,
  updateHeaderconfigProps,
  changeModeHeaderFooter,
  updateFooterconfigProps,
  restorePages,

  projSaveStart,
  projSaveSuccess,
  projSaveFailed,
  projSaveClearMessage,
  projLoadStart,
  projLoadSuccess,
  projLoadFailed,
  projLoadClearMessage,
  projLoadDeleteStart,
  projLoadDeleteSuccess,
  projLoadDeleteFailed,
  projLoadDeleteClearMessage,
  projLoadProjectStart,
  projLoadProjectSuccess,
  projLoadProjectFailed,
  projLoadProjectClearMessage
} = createActions(
  CHANGE_PROJECT_TITLE,
  ADD_OBJECT_TO_PAGE,
  ADD_OBJECT_ID_TO_SELECTED,
  ADD_OBJECT_ID_ACTION_SELECTED,
  REMOVE_SELECTION,
  REMOVE_ACTION_SELECTION,
  UPDATE_SELECTION_OBJECTS_COORDS,
  UPDATE_OBJECT_PROPS,
  UPDATE_OBJECT_PROPS_NO_UNDO_REDO,

  CHANGE_PAGE,
  UPDATE_CROP_PARAMS,
  CHANGE_GROUPS,
  ON_TEXT_CHANGE,
  CHANGE_RANDOM_PAGE,
  CHANGE_PAGES_ORDER,
  ADD_PAGES,
  ADD_OBJECT,
  ADD_TABLE,
  DELETE_OBJ,
  ADD_OBJECT_MIDDLE,
  DELETE_PAGE,
  UPDATE_HEADERCONFIG_PROPS,
  CHANGE_MODE_HEADER_FOOTER,
  UPDATE_FOOTERCONFIG_PROPS,
  RESTORE_PAGES,
  PROJ_SAVE_START,
  PROJ_SAVE_SUCCESS,
  PROJ_SAVE_FAILED,
  PROJ_SAVE_CLEAR_MESSAGE,
  PROJ_LOAD_START,
  PROJ_LOAD_SUCCESS,
  PROJ_LOAD_FAILED,
  PROJ_LOAD_CLEAR_MESSAGE,
  PROJ_LOAD_DELETE_START,
  PROJ_LOAD_DELETE_SUCCESS,
  PROJ_LOAD_DELETE_FAILED,
  PROJ_LOAD_DELETE_CLEAR_MESSAGE,
  PROJ_LOAD_PROJECT_START,
  PROJ_LOAD_PROJECT_SUCCESS,
  PROJ_LOAD_PROJECT_FAILED,
  PROJ_LOAD_PROJECT_CLEAR_MESSAGE
);

module.exports = {
  changeProjectTitle,
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
  changePagesOrder,
  addPages,
  addObject,
  addTable,
  deleteObj,
  addObjectMiddle,
  deletePage,
  updateHeaderconfigProps,
  updateFooterconfigProps,
  changeModeHeaderFooter,
  updateObjectPropsNoUndoRedo,
  restorePages,
  projSaveStart,
  projSaveSuccess,
  projSaveFailed,
  projSaveClearMessage,
  projLoadStart,
  projLoadSuccess,
  projLoadFailed,
  projLoadClearMessage,
  projLoadDeleteStart,
  projLoadDeleteSuccess,
  projLoadDeleteFailed,
  projLoadDeleteClearMessage,
  projLoadProjectStart,
  projLoadProjectSuccess,
  projLoadProjectFailed,
  projLoadProjectClearMessage
};
