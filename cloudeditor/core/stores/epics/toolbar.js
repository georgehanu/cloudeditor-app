const Rx = require("rxjs");
const { map, switchMap, mergeMap } = require("rxjs/operators");
const { ofType } = require("redux-observable");
const axios = require("../../../plugins/Fupa/axios");
const { Observable } = require("rxjs");
const React = require("react");
const ShowTable = require("../../../plugins/Fupa/components/TeamSelection/ShowTable/ShowTable");
const { renderToString } = require("react-dom/server");

const {
  UPDATE_LAYER_PROP,
  DUPLICATE_OBJ,
  DELETE_OBJ,
  UPDATE_OBJECT_PROPS,
  REFRESH_TABLE_START,
  REFRESH_TABLE_FAILED
} = require("../actionTypes/project");

const { SET_OBJECT_FROM_TOOLBAR } = require("../actionTypes/toolbar");
const { ADD_OBJECT_ID_TO_SELECTED } = require("../actionTypes/project");

const actions = require("../actions/toolbar");

function dispachEvent(action) {
  if (action.payload.action === undefined) {
    return {
      type: UPDATE_OBJECT_PROPS,
      payload: {
        id: action.payload.id,
        props: { ...action.payload.props, toolbarUpdate: true }
      }
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
  } else if (action.payload.action === "refreshTable") {
    return {
      type: REFRESH_TABLE_START,
      payload: action.payload
    };
  }
}

module.exports = {
  onEpicToolbar: (action$, state$) =>
    action$.pipe(
      ofType(SET_OBJECT_FROM_TOOLBAR),
      map(dispachEvent)
    ),
  onAddObjectToSelectedEpic: (action$, store) =>
    action$.pipe(
      ofType(ADD_OBJECT_ID_TO_SELECTED),
      switchMap(action => {
        const { payload } = action;
        return Rx.of(actions.setToolbarPosition(payload.boundingRect));
      })
    ),

  onEpicRefreshTable: (action$, state$) =>
    action$.pipe(
      ofType(REFRESH_TABLE_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          const fupaData = action$.payload.fupaData;
          axios
            .get(fupaData.queryData.query, {
              params: fupaData.queryData.data
            })
            .then(resp => resp.data)
            .then(data => {
              if (data.errors === false) {
                const formattedTable = renderToString(
                  <ShowTable
                    tableData={data.data}
                    tableName={fupaData.type}
                    fupaData={fupaData}
                    tableStyle="small"
                  />
                );
                obs.next({
                  type: UPDATE_OBJECT_PROPS,
                  payload: {
                    id: action$.payload.id,
                    props: {
                      tableContent: formattedTable,
                      toolbarUpdate: true,
                      refreshLoading: false
                    }
                  }
                });
              } else {
                obs.next({
                  type: UPDATE_OBJECT_PROPS,
                  payload: {
                    id: action$.payload.id,
                    props: { refreshLoading: false }
                  }
                });
              }
              obs.complete();
            })
            .catch(error => {
              obs.next({
                type: UPDATE_OBJECT_PROPS,
                payload: {
                  id: action$.payload.id,
                  props: { refreshLoading: false }
                }
              });
              obs.complete();
            });
        })
      )
    )
};
