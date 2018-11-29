const { Observable } = require("rxjs");
const { mapTo, map } = require("rxjs/operators");
const { ofType } = require("redux-observable");
const {
  UPDATE_LAYER_PROP,
  DUPLICATE_OBJ,
  DELETE_OBJ,
  UPDATE_OBJECT_PROPS
} = require("../actionTypes/project");

const { SET_OBJECT_FROM_TOOLBAR } = require("../actionTypes/toolbar");

function dispachEvent(action) {
  if (action.payload.action === undefined) {
    return {
      type: UPDATE_OBJECT_PROPS,
      payload: action.payload
    };
  } else if (action.payload.action === "layer") {
    return {
      type: UPDATE_LAYER_PROP,
      payload: action.payload
    };
  } else if (action.payload.action === "duplicate") {
    return {
      type: DUPLICATE_OBJ,
      payload: action.payload
    };
  } else if (action.payload.action === "delete") {
    return {
      type: DELETE_OBJ,
      payload: action.payload
    };
  }
}

module.exports = {
  onEpicToolbar: (action$, state$) =>
    action$.pipe(
      ofType(SET_OBJECT_FROM_TOOLBAR),
      map(dispachEvent)
    )
};
