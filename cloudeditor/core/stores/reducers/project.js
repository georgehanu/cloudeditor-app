const {
  append,
  mergeDeepLeft,
  forEachObjIndexed,
  reduce,
  without,
  merge
} = require("ramda");
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
  UPDATE_ACTIVE_SELECTION_PROPS,
  UPDATE_LAYER_PROP,
  DUPLICATE_OBJ,
  UPDATE_CROP_PARAMS,
  DELETE_OBJ,
  CHANGE_PAGE,
  CHANGE_GROUPS
} = require("../actionTypes/project");

const ProjectUtils = require("../../utils/ProjectUtils");
const ConfigUtils = require("../../utils/ConfigUtils");
const { handleActions } = require("redux-actions");
const uuidv4 = require("uuid/v4");

const changeProjectTitle = (state, action) => {
  return {
    ...state,
    title: action.title
  };
};

const addObject = (state, action) => {
  return {
    ...state,
    objects: {
      ...state.objects,
      [action.object.id]: action.object
    }
  };
};
const changePage = (state, payload) => {
  return {
    ...state,
    selectedPage: payload.page_id,
    activeGroup: payload.group_id
  };
};
const changeGroups = (state, payload) => {
  return {
    ...state,
    configs: {
      ...state.configs,
      document: {
        ...state.configs.document,
        groups: {
          ...state.configs.document.groups,
          ...payload
        }
      }
    }
  };
};

const addObjectToPage = (state, action) => {
  const { object } = action;
  const pageId = state.selectedPage;
  const page = {
    ...state.pages[state],
    objectsIds: state.pages[pageId].objectsIds.concat(object.id)
  };

  return {
    ...state,
    pages: {
      ...state.pages,
      [pageId]: {
        ...state.pages[pageId],
        objectsIds: append(object.id, state.pages[pageId].objectsIds)
      }
    },
    objects: {
      ...state.objects,
      [object.id]: object
    }
  };
};

const addObjectIdToSelected = (state, payload) => {
  return { ...state, selectedObjectsIds: [payload] };
};
const addObjectIdActionSelected = (state, payload) => {
  return { ...state, selectedActionObjectsIds: [payload] };
};
const updateObjectProps = (state, payload) => {
  return {
    ...state,
    objects: {
      ...state.objects,
      [payload.id]: merge(state.objects[payload.id], payload.props)
    }
  };
};
const removeSelection = (state, payload) => {
  let objectsChanges = [];
  if (payload.objectProps) {
    objectsChanges = reduce(
      (acc, value) => {
        const key = value.id;
        delete value.id;
        acc[key] = value;
        return acc;
      },
      {},
      payload.objectProps
    );
  }
  return {
    ...state,
    activeSelection: null,
    selectedObjectsIds: [],
    objects: mergeDeepLeft(objectsChanges, state.objects)
  };
};
const removeActionSelection = (state, payload) => {
  return {
    ...state,
    selectedActionObjectsIds: []
  };
};

const config = ConfigUtils.getDefaults();
const emptyProject = ProjectUtils.getRandomProject(config.project);

const initialState = {
  ...emptyProject,
  ui: ProjectUtils.getEmptyUI()
};

const swap = (index1, index2, list) => {
  if (
    index1 < 0 ||
    index2 < 0 ||
    index1 > list.length - 1 ||
    index2 > list.length - 1
  ) {
    return list; // index out of bound
  }
  const value1 = list[index1];
  const value2 = list[index2];

  let result = [...list];
  result[index1] = value2;
  result[index2] = value1;

  return result;
};

module.exports = handleActions(
  {
    [CHANGE_PROJECT_TITLE]: (state, action) => {
      return changeProjectTitle(state, action.payload);
    },
    [CHANGE_GROUPS]: (state, action) => {
      return changeGroups(state, action.payload);
    },
    [CHANGE_PAGE]: (state, action) => {
      return changePage(state, action.payload);
    },
    [ADD_OBJECT]: (state, action) => {
      return addObject(state, action.payload);
    },
    [ADD_OBJECT_TO_PAGE]: (state, action) => {
      return addObjectToPage(state, action.payload);
    },
    [ADD_OBJECT_ID_TO_SELECTED]: (state, action) => {
      return addObjectIdToSelected(state, action.payload);
    },
    [ADD_OBJECT_ID_ACTION_SELECTED]: (state, action) => {
      return addObjectIdActionSelected(state, action.payload);
    },
    [UPDATE_OBJECT_PROPS]: (state, action) => {
      return updateObjectProps(state, action.payload);
    },
    [REMOVE_SELECTION]: (state, action) => {
      return removeSelection(state, action.payload);
    },
    [REMOVE_ACTION_SELECTION]: (state, action) => {
      return removeActionSelection(state, action.payload);
    },
    [UPDATE_SELECTION_OBJECTS_COORDS]: (state, action) => {
      let objectsChanges = reduce(
        (acc, value) => {
          const key = value.id;
          delete value.id;
          acc[key] = value;
          return acc;
        },
        {},
        action.payload.objectProps
      );
      return {
        ...state,
        activeSelection: action.payload.props,
        objects: mergeDeepLeft(objectsChanges, state.objects)
      };
    },
    [UPDATE_ACTIVE_SELECTION_PROPS]: (state, action) => {
      return {
        ...state,
        activeSelection: action.payload
      };
    },
    [UPDATE_CROP_PARAMS]: (state, action) => {
      return {
        ...state,
        objects: {
          ...state.objects,
          [action.payload.id]: merge(
            state.objects[action.payload.id],
            action.payload.props
          )
        }
      };
    },
    [UPDATE_ACTIVE_SELECTION_PROPS]: (state, action) => {
      return {
        ...state,
        activeSelection: action.payload
      };
    },
    [UPDATE_LAYER_PROP]: (state, action) => {
      const objId = action.payload.id;
      const layerAction = action.payload.props.action;

      let newObjectsId = [...state.pages[state.activePage].objectsIds];
      const objIndex = newObjectsId.findIndex(el => {
        return el === objId;
      });

      if (layerAction === "bringtofront") {
        newObjectsId.splice(objIndex, 1);
        newObjectsId = [
          ...newObjectsId,
          state.pages[state.activePage].objectsIds[objIndex]
        ];
      } else if (layerAction === "bringforward") {
        newObjectsId = swap(objIndex, objIndex + 1, newObjectsId);
      } else if (layerAction === "sendbackward") {
        newObjectsId = swap(objIndex, objIndex - 1, newObjectsId);
      } else if (layerAction === "sendtoback") {
        newObjectsId.splice(objIndex, 1);
        newObjectsId = [
          state.pages[state.activePage].objectsIds[objIndex],
          ...newObjectsId
        ];
      }

      return {
        ...state,
        pages: {
          ...state.pages,
          [state.activePage]: {
            ...state.pages[state.activePage],
            objectsIds: newObjectsId
          }
        }
      };
    },
    [DUPLICATE_OBJ]: (state, action) => {
      console.log("duplicate");
      const originalObj = state.objects[action.payload.id];
      const duplicateObj = {
        ...originalObj,
        id: uuidv4(),
        top: originalObj.top + 30,
        left: originalObj.left + 30
      };
      return addObjectToPage(state, {
        object: duplicateObj,
        pageId: state.activePage
      });
    },
    [DELETE_OBJ]: (state, action) => {
      let newObjects = { ...state.objects };
      delete newObjects[action.payload.id];

      const newObjectsId = state.pages[state.activePage].objectsIds.filter(
        el => {
          return el !== action.payload.id;
        }
      );

      return {
        ...state,
        pages: {
          ...state.pages,
          [state.activePage]: {
            ...state.pages[state.activePage],
            objectsIds: newObjectsId
          }
        },
        objects: newObjects,
        selectedObjectsIds: []
      };
    }
  },
  initialState
);
