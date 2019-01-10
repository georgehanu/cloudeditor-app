const {
  append,
  mergeDeepLeft,
  clone,
  reduce,
  insertAll,
  merge,
  without,
  head
} = require("ramda");
const {
  CHANGE_PROJECT_TITLE,
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
  CHANGE_GROUPS,
  CHANGE_RANDOM_PAGE,
  CHANGE_PAGES_ORDER,
  ADD_PAGES,
  ADD_OBJECT,
  ADD_TABLE,
  ADD_OBJECT_MIDDLE,
  DELETE_PAGE,

  UPDATE_HEADERCONFIG_PROPS,
  UPDATE_FOOTERCONFIG_PROPS,
  PROJ_SAVE_START,
  PROJ_SAVE_SUCCESS,
  PROJ_SAVE_FAILED,
  PROJ_SAVE_CLEAR_MESSAGE,
  PROJ_LOAD_START,
  PROJ_LOAD_SUCCESS,
  PROJ_LOAD_FAILED,
  PROJ_LOAD_CLEAR_MESSAGE
} = require("../actionTypes/project");

const ProjectUtils = require("../../utils/ProjectUtils");
const ConfigUtils = require("../../utils/ConfigUtils");
const { handleActions } = require("redux-actions");
const uuidv4 = require("uuid/v4");

const addPages = (state, action) => {
  const { activePage, pages, pagesOrder } = state;
  let newPages = { ...pages };
  const { nrPagesToInsert, location } = action;
  let newIds = [];
  let newOrder = clone(pagesOrder);
  const firstPage = newPages[head(pagesOrder)];
  const firstPageWidth = firstPage["width"];
  const firstPageHeight = firstPage["height"];
  for (let i = 0; i < nrPagesToInsert; i++) {
    const emptyPage = ProjectUtils.getEmptyPage({
      width: firstPageWidth,
      height: firstPageHeight
    });
    const { id } = emptyPage;
    newPages[id] = emptyPage;
    newIds.push(id);
  }
  let pageIndex = pagesOrder.findIndex(el => {
    return el === activePage;
  });
  switch (location) {
    case "after":
      pageIndex++;
      break;
    case "end":
      pageIndex = pagesOrder.length;
      break;
    default:
      break;
  }
  newOrder = insertAll(pageIndex, newIds, pagesOrder);
  return {
    ...state,
    pages: {
      ...state.pages,
      ...newPages
    },
    pagesOrder: newOrder
  };
};
const deletePage = (state, action) => {
  const { page_id } = action;
  const { pages, pagesOrder } = state;
  const newOrder = without(page_id, pagesOrder);
  const newPages = without(page_id, pages);
  return {
    ...state,
    pages: newPages,
    pagesOrder: newOrder
  };
};
const changeProjectTitle = (state, action) => {
  return {
    ...state,
    title: action.title
  };
};

const changePagesOrder = (state, action) => {
  return { ...state, pagesOrder: action.pages, activePage: action.page_id };
};

const addObject = (state, action) => {
  const object = ProjectUtils.getEmptyObject(action);
  const pageId = state.activePage;
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
const addTable = (state, action) => {
  const object = ProjectUtils.getEmptyObject(action);
  const pageId = state.activePage;
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
const changePage = (state, payload) => {
  return {
    ...state,
    activePage: payload.page_id
  };
};
const changeRandomPage = (state, payload) => {
  return {
    ...state,
    objects: {
      ...state.objects,
      "14adb525-49bc-4da4-b497-922a6aebbb3a": {
        ...state.objects["14adb525-49bc-4da4-b497-922a6aebbb3a"],
        width: 500 + Math.random() * 500
      }
    }
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

const addObjectIdToSelected = (state, payload) => {
  return { ...state, selectedObjectsIds: [payload.id] };
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
const updateHeaderConfigProps = (state, payload) => {
  return {
    ...state,
    configs: {
      ...state.configs,
      document: {
        ...state.configs.document,
        header: {
          ...state.configs.document.header,
          [payload.prop]: payload.value
        }
      }
    }
  };
};

const updateFooterConfigProps = (state, payload) => {
  return {
    ...state,
    configs: {
      ...state.configs,
      document: {
        ...state.configs.document,
        footer: {
          ...state.configs.document.footer,
          [payload.prop]: payload.value
        }
      }
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
//const emptyProject = ProjectUtils.getRandomProject(config.project);
const emptyProject = ProjectUtils.getEmptyProject(config.project);

const initialState = {
  ...emptyProject
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
addObjectMiddle = (state, action) => {
  const pageId = state.activePage;
  const page = state.pages[pageId];
  const { width, height } = page;
  let blockWidth = width / 6;
  let blockHeight = blockWidth * (height / width);
  if (width > height) {
    blockHeight = height / 6;
    blockWidth = blockHeight * (width / height);
  }
  const left = (width - blockWidth) / 2;
  const top = (height - blockHeight) / 2;
  const defaultBlock = {
    ...action,
    left,
    top,
    width: blockWidth,
    height: blockHeight
  };
  const object = ProjectUtils.getEmptyObject(defaultBlock);
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

module.exports = handleActions(
  {
    [CHANGE_PROJECT_TITLE]: (state, action) => {
      return changeProjectTitle(state, action.payload);
    },
    [ADD_OBJECT]: (state, action) => {
      return addObject(state, action.payload);
    },
    [ADD_TABLE]: (state, action) => {
      return addTable(state, action.payload);
    },
    [ADD_PAGES]: (state, action) => {
      return addPages(state, action.payload);
    },
    [CHANGE_PAGES_ORDER]: (state, action) => {
      return changePagesOrder(state, action.payload);
    },
    [CHANGE_RANDOM_PAGE]: (state, action) => {
      return changeRandomPage(state, action.payload);
    },
    [CHANGE_GROUPS]: (state, action) => {
      return changeGroups(state, action.payload);
    },
    [CHANGE_PAGE]: (state, action) => {
      return changePage(state, action.payload);
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
    [UPDATE_HEADERCONFIG_PROPS]: (state, action) => {
      return updateHeaderConfigProps(state, action.payload);
    },
    [UPDATE_FOOTERCONFIG_PROPS]: (state, action) => {
      return updateFooterConfigProps(state, action.payload);
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
      const originalObj = state.objects[action.payload.id];
      const duplicateObj = {
        ...originalObj,
        id: uuidv4(),
        top: originalObj.top + 30,
        left: originalObj.left + 30
      };
      return addObject(state, duplicateObj);
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
    },
    [ADD_OBJECT_MIDDLE]: (state, action) => {
      return addObjectMiddle(state, action.payload);
    },
    [DELETE_PAGE]: (state, action) => {
      return deletePage(state, action.payload);
    },
    [PROJ_SAVE_START]: (state, action) => {
      return {
        ...state,
        save: {
          ...state.save,
          loading: true
        }
      };
    },
    [PROJ_SAVE_SUCCESS]: (state, action) => {
      console.log("action", action);
      return {
        ...state,
        save: {
          ...state.save,
          loading: false,
          errorMessage: "Project saved"
        },
        title: action.name,
        description: action.description
      };
    },
    [PROJ_SAVE_FAILED]: (state, action) => {
      return {
        ...state,
        save: {
          ...state.save,
          loading: false,
          errorMessage: action.payload
        }
      };
    },
    [PROJ_SAVE_CLEAR_MESSAGE]: (state, action) => {
      return {
        ...state,
        save: {
          ...state.save,
          errorMessage: null
        }
      };
    }
  },
  initialState
);
