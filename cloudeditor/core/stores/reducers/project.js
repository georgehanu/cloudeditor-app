const {
  append,
  mergeDeepLeft,
  clone,
  reduce,
  insertAll,
  merge,
  without,
  head,
  last,
  omit,
  pick,
  pathOr,
  values,
  forEachObjIndexed
} = require("ramda");
const {
  CHANGE_PROJECT_TITLE,
  ADD_OBJECT_TO_PAGE,
  ADD_OBJECT_ID_TO_SELECTED,
  ADD_OBJECT_ID_ACTION_SELECTED,
  REMOVE_SELECTION,
  REMOVE_ACTION_SELECTION,
  UPDATE_SELECTION_OBJECTS_COORDS,
  UPDATE_PAGE_PROPS,
  UPDATE_OBJECT_PROPS,
  UPDATE_OBJECT_PROPS_NO_UNDO_REDO,
  UPDATE_ACTIVE_SELECTION_PROPS,
  UPDATE_LAYER_PROP,
  DUPLICATE_OBJ,
  UPDATE_CROP_PARAMS,
  DELETE_OBJ,
  DELETE_IMAGE,
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
  CHANGE_MODE_HEADER_FOOTER,
  UPDATE_FOOTERCONFIG_PROPS,
  RESTORE_PAGES,
  PROJ_SAVE_START,
  PROJ_SAVE_SUCCESS,
  PROJ_SAVE_FAILED,
  PROJ_SHOW_POPUP,
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
  PROJ_LOAD_PROJECT_CLEAR_MESSAGE,
  PROJ_LOAD_LAYOUT,
  CHANGE_BACKGROUND,
  CHANGE_MAGNETIC,
  REFRESH_TABLE_START,
  REFRESH_TABLE_FAILED,
  CHANGE_HEADER_FOOTER_LAYOUT
} = require("../actionTypes/project");

const ProjectUtils = require("../../utils/ProjectUtils");
const ConfigUtils = require("../../utils/ConfigUtils");
const { handleActions } = require("redux-actions");
const {
  projectHeaderEnabledSelector,
  projectFooterEnabledSelector,
  projectHeaderConfigSelector,
  projectFooterConfigSelector
} = require("../selectors/project");
const uuidv4 = require("uuid/v4");

const addPages = (state, action) => {
  const { activePage, pages, pagesOrder } = state;
  let newPages = { ...pages };
  const { nrPagesToInsert, location } = action;
  let newObjects = {};
  let newIds = [];
  let newOrder = clone(pagesOrder);
  const firstPage = newPages[head(pagesOrder)];
  const firstPageWidth = firstPage["width"];
  const firstPageHeight = firstPage["height"];
  for (let i = 0; i < nrPagesToInsert; i++) {
    if (state.emptyPage) {
      let savedData = JSON.parse(state.emptyPage);
      if (state.configs.document.includeBoxes)
        savedData = savedData.with_trimbox;
      else savedData = savedData.no_trimbox;
      const pageObjects = Object.keys(savedData.activePage.objects).map(key => {
        const id = uuidv4();
        if (!savedData.activePage.objects[key].hasOwnProperty("objectsIds")) {
          newObjects[id] = { ...savedData.activePage.objects[key], id: id };
          return { ...savedData.activePage.objects[key], id: id };
        }
      });
      // store the new keys into objectsIds
      const addPageObj = {};
      const pageObj = pageObjects.map(el => {
        addPageObj[el.id] = el;
        return el.id;
      });
      const page_id = uuidv4();
      const newActivePage = {
        ...savedData.activePage.page,
        id: page_id,
        objectsIds: [...pageObj]
      };
      newPages[page_id] = newActivePage;
      newIds.push(page_id);
    }
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
      const lastPageId = last(pagesOrder);
      const lastPage = pages[lastPageId];
      if (lastPage.lockPosition) {
        pageIndex = pagesOrder.length - 1;
      }
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
    objects: {
      ...state.objects,
      ...newObjects
    },
    pagesOrder: newOrder
  };
};

const restorePages = (state, action) => {
  return {
    ...state,
    pages: {
      ...action.pages
    },
    pagesOrder: [...action.pagesOrder],
    activePage: action.activePage
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
  return {
    ...state,
    pagesOrder: [...action.pages],
    activePage: action.page_id
  };
};

const addObject = (state, action) => {
  return addCreatedObject(state, action, ProjectUtils.getEmptyObject(action));
};

const addObjectToHeaderFooter = (state, action, pageHF, object) => {
  const headerA = pick([pageHF], state.objects);
  if (!headerA) {
    return state;
  }
  return {
    ...state,
    objects: {
      ...state.objects,
      [pageHF]: {
        ...state.objects[pageHF],
        objectsIds: append(object.id, state.objects[pageHF].objectsIds)
      },
      [object.id]: object
    }
  };
};

deleteObjectFromHeaderFooter = (state, action, pageHF) => {
  let newObjects = omit([action.payload.id], state.objects);
  const newhfItem = {
    ...state.objects[pageHF],
    objectsIds: state.objects[pageHF].objectsIds.filter(el => {
      return el !== action.payload.id;
    })
  };
  return {
    ...state,
    objects: {
      ...newObjects,
      [pageHF]: newhfItem
    },
    selectedObjectsIds: []
  };
};

const addTable = (state, action) => {
  const headerSelector = projectHeaderEnabledSelector(state);
  const footerSelector = projectFooterEnabledSelector(state);
  if (headerSelector) {
    return addObjectMiddle(state, action);
  } else if (footerSelector) {
    return addObjectMiddle(state, action);
  }

  return addCreatedObject(state, action, ProjectUtils.getEmptyObject(action));
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
  if (payload.props.image) {
    /* update the image with given imageId */
    return updateImageProps(state, payload);
  }
  if (typeof payload.props.leftSlider != "undefined") {
    const props = { ...payload.props };
    props.noCrop = false;
    if (payload.props.leftSlider === -1) {
      const objectProps = { ...state.objects[payload.id] };
      props.cropX = 0;
      props.cropY = 0;
      props.cropW = 0;
      props.cropH = 0;
      props.noCrop = true;
      const ratioWidth = objectProps.imageWidth / objectProps.imageHeight;
      const ratioHeight = objectProps.imageHeight / objectProps.imageWidth;
      if (ratioWidth > ratioHeight) {
        props.height = objectProps.width / ratioWidth;
      } else {
        props.width = objectProps.height / ratioHeight;
      }
    }
    return {
      ...state,
      objects: {
        ...state.objects,
        [payload.id]: merge(state.objects[payload.id], props)
      }
    };
  }
  return {
    ...state,
    objects: {
      ...state.objects,
      [payload.id]: merge(state.objects[payload.id], payload.props)
    }
  };
};

const updateImageProps = (state, payload) => {
  const imageProps = {
    image_src: payload.props.image.image_src,
    value: payload.props.image.image_src.substring(
      payload.props.image.image_src.lastIndexOf("/") + 1
    ),
    image_path: payload.props.image.image_path,
    cropX: 0,
    cropY: 0,
    cropW: 0,
    cropH: 0,
    leftSlider: 0,
    imageWidth: payload.props.image.imageWidth,
    imageHeight: payload.props.image.imageHeight,
    ratioWidth: payload.props.image.ratioWidth,
    ratioHeight: payload.props.image.ratioHeight,
    image: payload.props.image,
    subType: payload.props.image.subType
  };

  return {
    ...state,
    objects: {
      ...state.objects,
      [payload.id]: merge(state.objects[payload.id], imageProps)
    }
  };
};
const updatePageProps = (state, payload) => {
  return {
    ...state,
    pages: {
      ...state.pages,
      [payload.id]: merge(state.pages[payload.id], payload.props)
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
const updateHeaderFooterConfigProps = (state, payload) => {
  return {
    ...state,
    configs: {
      ...state.configs,
      document: {
        ...state.configs.document,
        header: {
          ...state.configs.document.header,
          [payload.header.prop]: payload.header.value
        },
        footer: {
          ...state.configs.document.footer,
          [payload.footer.prop]: payload.footer.value
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
const changeHeaderFooterLayout = (state, payload) => {
  const layout = { ...payload.layout };
  const objects = { ...state.objects };
  const savedData = JSON.parse(layout.saved_data);
  const type = layout.type;
  let skipIds = [];
  skipIds = ProjectUtils.getObjectHeaderFooterIds(
    state.configs.document[layout.type].objectsIds,
    state.objects,
    []
  );
  let newObjects = {};
  Object.keys(objects).map(function(key) {
    if (skipIds.indexOf(key) === -1) {
      newObjects[key] = objects[key];
    }
  });
  newObjects = merge(newObjects, savedData.blocks);
  return {
    ...state,
    objects: newObjects,
    configs: {
      ...state.configs,
      document: {
        ...state.configs.document,
        [type]: {
          ...state.configs.document[type],
          height: parseInt(savedData[type]["height"]),
          objectsIds: savedData[type]["objectsIds"]
        }
      }
    }
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
  const headerSelector = projectHeaderEnabledSelector(state);
  const footerSelector = projectFooterEnabledSelector(state);
  let defaultBlock = {};

  let colNumbers = pathOr(0, ["configs", "pages", "columnsNo"], state);
  colNumbers = pathOr(colNumbers, ["columnsNo"], page);
  const columnSpacing = pathOr(0, ["configs", "pages", "columnSpacing"], state);
  const safeCutDocument = pathOr(0, ["configs", "pages", "safeCut"], state);
  const allowSafeCut = pathOr(0, ["configs", "pages", "allowSafeCut"], state);
  const widthPage =
    width +
    page["boxes"]["trimbox"]["left"] +
    page["boxes"]["trimbox"]["right"];
  const safeCut =
    Math.max(...values(page["boxes"]["trimbox"])) * 2 + safeCutDocument;
  let leftMargin = 0;
  let rightMargin = 0;
  if (allowSafeCut) {
    leftMargin = safeCut;
    rightMargin = leftMargin;
  } else {
    leftMargin = page["boxes"]["trimbox"]["left"];
    rightMargin = page["boxes"]["trimbox"]["right"];
  }
  blockWidth = widthPage - 2 * safeCut - (colNumbers - 1) * columnSpacing - 2;
  if (colNumbers) {
    blockWidth =
      (widthPage - 2 * safeCut - (colNumbers - 1) * columnSpacing) /
        colNumbers -
      2;
  }
  let blockHeight = blockWidth * 0.5;
  const left = (width - blockWidth) / 2;
  const top = (height - blockHeight) / 2;

  defaultBlock = {
    ...action,
    left,
    top,
    width: blockWidth,
    height: blockHeight
  };

  if (headerSelector) {
    defaultBlock = {
      ...defaultBlock,
      top: 0,
      height: projectHeaderConfigSelector(state).height
    };
  } else if (footerSelector) {
    defaultBlock = {
      ...defaultBlock,
      top: 0,
      height: projectFooterConfigSelector(state).height
    };
  }
  return addCreatedObject(
    state,
    action,
    ProjectUtils.getEmptyObject(defaultBlock)
  );
};

const addCreatedObject = (state, action, object) => {
  const headerSelector = projectHeaderEnabledSelector(state);
  const footerSelector = projectFooterEnabledSelector(state);
  if (headerSelector) {
    return addObjectToHeaderFooter(state, action, "header", object);
  } else if (footerSelector) {
    return addObjectToHeaderFooter(state, action, "footer", object);
  }
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

handleLoad = (state, loadData) => {
  return { ...state, load: { ...state.load, ...loadData } };
};

handleSave = (state, saveData) => {
  return { ...state, save: { ...state.save, ...saveData } };
};

loadLayout = (state, payload) => {
  // remove the objects that are currently belonging to the current page
  const newObjects = omit(
    state.pages[state.activePage].objectsIds,
    state.objects
  );

  // add the new objects ... create new ids
  let savedData = JSON.parse(payload.saved_data);
  if (payload.page_id === "*") {
    if (state.configs.document.includeBoxes) savedData = savedData.with_trimbox;
    else savedData = savedData.no_trimbox;
  }
  const pageObjects = Object.keys(savedData.activePage.objects).map(key => {
    const id = uuidv4();
    if (!savedData.activePage.objects[key].hasOwnProperty("objectsIds"))
      return { ...savedData.activePage.objects[key], id: id };
  });
  // store the new keys into objectsIds
  const addPageObj = {};
  const pageObj = pageObjects.map(el => {
    addPageObj[el.id] = el;
    return el.id;
  });

  const newActivePage = {
    ...savedData.activePage.page,
    objectsIds: [...pageObj]
  };

  return {
    ...state,
    pages: {
      ...state.pages,
      [state.activePage]: { ...newActivePage }
    },
    objects: {
      ...newObjects,
      ...addPageObj
    }
  };
};
changeBackground = (state, _) => {
  const activePageId = state.activePage;
  const objectsIds = state.pages[activePageId].objectsIds;
  const backgroundObject = objectsIds.filter(el => {
    return state.objects[el].backgroundblock;
  });
  let selectedObjectsIds = [];
  if (backgroundObject.length) {
    selectedObjectsIds.push(head(backgroundObject));
  }
  return { ...state, selectedObjectsIds };
};
changeMagnetic = (state, payload) => {
  return {
    ...state,
    configs: {
      ...state.configs,
      document: {
        ...state.configs.document,
        includeMagnetic: payload.allowMagnetic
      }
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
    [UPDATE_PAGE_PROPS]: (state, action) => {
      return updatePageProps(state, action.payload);
    },
    [UPDATE_OBJECT_PROPS]: (state, action) => {
      return updateObjectProps(state, action.payload);
    },
    [UPDATE_OBJECT_PROPS_NO_UNDO_REDO]: (state, action) => {
      return updateObjectProps(state, action.payload);
    },
    [UPDATE_HEADERCONFIG_PROPS]: (state, action) => {
      return updateHeaderConfigProps(state, action.payload);
    },
    [CHANGE_MODE_HEADER_FOOTER]: (state, action) => {
      return updateHeaderFooterConfigProps(state, action.payload);
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
    [CHANGE_HEADER_FOOTER_LAYOUT]: (state, action) => {
      return changeHeaderFooterLayout(state, action.payload);
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
      const headerSelector = projectHeaderEnabledSelector(state);
      const footerSelector = projectFooterEnabledSelector(state);
      const objId = action.payload.id;
      const layerAction = action.payload.props.action;
      let typeHF = null;

      let orObjects = [];
      if (headerSelector || footerSelector) {
        typeHF = headerSelector ? "header" : "footer";
        orObjects = state.objects[typeHF].objectsIds;
      } else {
        orObjects = state.pages[state.activePage].objectsIds;
      }
      let newObjectsId = [...orObjects];

      const objIndex = newObjectsId.findIndex(el => {
        return el === objId;
      });

      if (layerAction === "bringtofront") {
        newObjectsId.splice(objIndex, 1);
        newObjectsId = [...newObjectsId, orObjects[objIndex]];
      } else if (layerAction === "bringforward") {
        newObjectsId = swap(objIndex, objIndex + 1, newObjectsId);
      } else if (layerAction === "sendbackward") {
        newObjectsId = swap(objIndex, objIndex - 1, newObjectsId);
      } else if (layerAction === "sendtoback") {
        newObjectsId.splice(objIndex, 1);
        newObjectsId = [orObjects[objIndex], ...newObjectsId];
      }

      if (headerSelector || footerSelector) {
        return {
          ...state,
          objects: {
            ...state.objects,
            [typeHF]: {
              ...state.objects[typeHF],
              objectsIds: newObjectsId
            }
          }
        };
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
      const headerSelector = projectHeaderEnabledSelector(state);
      const footerSelector = projectFooterEnabledSelector(state);
      if (headerSelector) {
        return deleteObjectFromHeaderFooter(state, action, "header");
      } else if (footerSelector) {
        return deleteObjectFromHeaderFooter(state, action, "footer");
      }

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
    [RESTORE_PAGES]: (state, action) => {
      return restorePages(state, action.payload);
    },
    [PROJ_SAVE_START]: (state, action) => {
      return handleSave(state, {
        loading: true,
        showAlert: false
      });
    },
    [PROJ_SAVE_SUCCESS]: (state, action) => {
      return {
        ...state,
        save: {
          ...state.save,
          loading: false,
          errorMessage: action.message,
          showAlert: false
        },
        title: action.name,
        description: action.description,
        projectId: state.projectId !== null ? state.projectId : action.projectId
      };
    },
    [PROJ_SAVE_FAILED]: (state, action) => {
      return handleSave(state, {
        loading: false,
        errorMessage: action.payload,
        showAlert: false
      });
    },
    [PROJ_SHOW_POPUP]: (state, action) => {
      return handleSave(state, {
        loading: false,
        errorMessage: action.payload,
        showAlert: true
      });
    },
    [PROJ_SAVE_CLEAR_MESSAGE]: (state, action) => {
      return handleSave(state, { errorMessage: null, showAlert: false });
    },
    [PROJ_LOAD_START]: (state, action) => {
      return handleLoad(state, { loading: true });
    },
    [PROJ_LOAD_SUCCESS]: (state, action) => {
      return handleLoad(state, {
        loading: false,
        errorMessage: null,
        loadedProjects: action.data
      });
    },
    [PROJ_LOAD_FAILED]: (state, action) => {
      return handleLoad(state, {
        loading: false,
        errorMessage: action.payload
      });
    },
    [PROJ_LOAD_CLEAR_MESSAGE]: (state, action) => {
      return handleLoad(state, { errorMessage: null });
    },
    [PROJ_LOAD_DELETE_START]: (state, action) => {
      return handleLoad(state, { loadingDelete: true });
    },
    [PROJ_LOAD_DELETE_SUCCESS]: (state, action) => {
      return handleLoad(state, {
        loadingDelete: false,
        errorMessageDelete: null,
        loadedProjects: state.load.loadedProjects.filter(function(project) {
          return project.projectId !== action.projectId;
        })
      });
    },
    [PROJ_LOAD_DELETE_FAILED]: (state, action) => {
      return handleLoad(state, {
        loadingDelete: false,
        errorMessageDelete: action.payload
      });
    },
    [PROJ_LOAD_DELETE_CLEAR_MESSAGE]: (state, action) => {
      return handleLoad(state, { errorMessageDelete: null });
    },
    [PROJ_LOAD_PROJECT_START]: (state, action) => {
      return handleLoad(state, { loadingProject: true });
    },
    [PROJ_LOAD_PROJECT_SUCCESS]: (state, action) => {
      var data = action.data;
      var project_data = data.project_data;
      Object.keys(project_data.objects).map(obKey => {
        project_data.objects[obKey]["renderId"] = uuidv4();
        if (project_data.objects[obKey]["type"] == "image") {
          project_data.objects[obKey]["workingPercent"] = -1;
        }
      });
      return {
        ...state,
        title: project_data.title,
        description: project_data.description,
        projectId: data.projectId,
        pages: project_data.pages,
        objects: project_data.objects,
        configs: {
          ...state.configs,
          document: {
            ...state.configs.document,
            header: project_data.header,
            footer: project_data.footer
          }
        },
        pagesOrder: project_data.pagesOrder,
        activePage: head(project_data.pagesOrder),
        load: {
          ...state.load,
          loadingProject: false,
          errorMessageProject: null
        },
        projectId: action.projectId
      };
    },
    [PROJ_LOAD_PROJECT_FAILED]: (state, action) => {
      return handleLoad(state, {
        loadingProject: false,
        errorMessageProject: action.payload
      });
    },
    [PROJ_LOAD_PROJECT_CLEAR_MESSAGE]: (state, action) => {
      return handleLoad(state, { errorMessageProject: null });
    },
    [PROJ_LOAD_LAYOUT]: (state, action) => {
      return loadLayout(state, action.payload);
    },
    [CHANGE_BACKGROUND]: (state, action) => {
      return changeBackground(state, action.payload);
    },
    [CHANGE_MAGNETIC]: (state, action) => {
      return changeMagnetic(state, action.payload);
    },
    [REFRESH_TABLE_FAILED]: (state, action) => {
      return state;
    },
    [REFRESH_TABLE_START]: (state, action) => {
      return updateObjectProps(state, {
        id: action.payload.id,
        props: { refreshLoading: true }
      });
    }
  },
  initialState
);
