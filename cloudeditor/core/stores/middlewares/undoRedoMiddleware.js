const { createUndoMiddleware } = require("@intactile/redux-undo-redo");
const {
  updateObjectProps,
  addObject,
  changePage,
  deleteObj,
  updateHeaderconfigProps,
  updateFooterconfigProps,
  changePagesOrder,
  restorePages
} = require("../actions/project");
const { mergeAll, pathOr, clone } = require("ramda");
const getObject = (state, action) => {
  const id = action.payload.id;
  const object = { ...state.project.objects[id] };
  const defaults = { ...state.project.configs.objects };
  let props = {};
  Object.keys(action.payload.props).map(el => {
    props[el] = defaults.generalCfg[el];
    if (typeof object[el] != "undefined") props[el] = object[el];
  });
  return {
    id,
    props
  };
};
const {
  UPDATE_OBJECT_PROPS_NO_UNDO_REDO,
  UPDATE_OBJECT_PROPS
} = require("../../../core/stores/actionTypes/project");
const getPage = (state, action) => {
  return {
    page_id: pathOr("", ["project", "activePage"], { ...state })
  };
};
const getFooterConfig = (state, action) => {
  return {
    prop: action.payload.prop,
    value: pathOr(
      false,
      ["project", "configs", "document", "footer", action.payload.prop],
      state
    )
  };
};
const getHeaderConfig = (state, action) => {
  return {
    prop: action.payload.prop,
    value: pathOr(
      "",
      ["project", "configs", "document", "header", action.payload.prop],
      state
    )
  };
};
const getPagesOrder = (state, action) => {
  return {
    page_id: clone(pathOr("", ["project", "activePage"], state)),
    pages: clone(pathOr([], ["project", "pagesOrder"], state))
  };
};
const getPagesToRestore = (state, action) => {
  return {
    activePage: pathOr("", ["project", "activePage"], state),
    pagesOrder: pathOr([], ["project", "pagesOrder"], state),
    pages: pathOr([], ["project", "pages"], state)
  };
};
const undoRedoMiddleware = createUndoMiddleware({
  getViewState: state => {
    return { ...state.project };
  },
  revertingActions: {
    [UPDATE_OBJECT_PROPS]: {
      action: (_, payload) => updateObjectProps(payload),
      createArgs: (state, action) => {
        return getObject(state, action);
      },
      groupWithPrevious: (action, previousAction) =>
        previousAction.type === UPDATE_OBJECT_PROPS_NO_UNDO_REDO
    },
    [UPDATE_OBJECT_PROPS_NO_UNDO_REDO]: {
      action: (_, payload) => updateObjectProps(payload),
      createArgs: (state, action) => {
        return getObject(state, action);
      },
      groupWithPrevious: (action, previousAction) =>
        action.type === previousAction.type
    },
    DELETE_OBJ: {
      action: (_, payload) => addObject(payload.props),
      createArgs: (state, action) => {
        return getObject(state, action);
      }
    },
    ADD_OBJECT: action => deleteObj({ id: action.payload.id }),
    ADD_OBJECT_MIDDLE: action => deleteObj({ id: action.payload.id }),
    CHANGE_PAGE: {
      action: (_, payload) => changePage(payload),
      createArgs: (state, action) => {
        return getPage({ ...state }, action);
      }
    },
    UPDATE_HEADERCONFIG_PROPS: {
      action: (_, payload) => updateHeaderconfigProps(payload),
      createArgs: (state, action) => {
        return getHeaderConfig(state, action);
      }
    },
    UPDATE_FOOTERCONFIG_PROPS: {
      action: (_, payload) => updateFooterconfigProps(payload),
      createArgs: (state, action) => {
        return getFooterConfig(state, action);
      }
    },
    CHANGE_PAGES_ORDER: {
      action: (_, payload) => restorePages(payload),
      createArgs: (state, action) => {
        return getPagesToRestore(state, action);
      }
    }
  }
});
module.exports = undoRedoMiddleware;
