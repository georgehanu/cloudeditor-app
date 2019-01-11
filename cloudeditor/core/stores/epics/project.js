const { mapTo } = require("rxjs/operators");
const { ofType } = require("redux-observable");
const { mergeMap } = require("rxjs/operators");
const axios = require("axios");
const { Observable } = require("rxjs");

const { rerenderPage } = require("../../../core/utils/UtilUtils");
const { ADD_IMAGE_FROM_BUTTON } = require("../actionTypes/addButton");
const {
  CHANGE_PAGE,
  PROJ_SAVE_START,
  PROJ_SAVE_SUCCESS,
  PROJ_SAVE_FAILED,
  PROJ_LOAD_START,
  PROJ_LOAD_SUCCESS,
  PROJ_LOAD_FAILED
} = require("../actionTypes/project");

const SAVE_PROJ = "http://work.cloudlab.at:9012/ig/designAndGoUpload/save.php";
const LOAD_PROJ = "http://work.cloudlab.at:9012/ig/designAndGoUpload/load.php";

const dispachEvent = () => {
  setTimeout(() => {
    // rerenderPage();
  }, 0);
};
module.exports = {
  onEpic: (action$, state$) =>
    action$.pipe(
      ofType("ADD_OBJECT_TO_PAGE"),
      mapTo({ type: ADD_IMAGE_FROM_BUTTON, title: state$.value.project.title })
    ),
  onChangePage: (action$, state$) =>
    action$.pipe(
      ofType("CHANGE_PAGE"),
      mapTo(dispachEvent)
    ),

  onEpicSave: (action$, state$) =>
    action$.pipe(
      ofType(PROJ_SAVE_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let serverData = new FormData();
          serverData.append("userId", action$.payload.userId);
          serverData.append("name", action$.payload.name);
          serverData.append("description", action$.payload.description);
          serverData.append("projectId", action$.payload.projectId);

          axios
            .post(SAVE_PROJ, serverData)
            .then(resp => resp.data)
            .then(data => {
              if (data.status !== "failure") {
                obs.next({
                  type: PROJ_SAVE_SUCCESS,
                  name: action$.payload.name,
                  description: action$.payload.description,
                  projectId: data.projectId
                });
              } else {
                obs.next({
                  type: PROJ_SAVE_FAILED,
                  payload: data.error_message
                });
              }
              obs.complete();
            })
            .catch(error => {
              obs.next({
                type: PROJ_SAVE_FAILED,
                payload: "Error message: " + error.message
              });
              obs.complete();
            });
        })
      )
    ),

  onEpicLoad: (action$, state$) =>
    action$.pipe(
      ofType(PROJ_LOAD_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let serverData = new FormData();
          serverData.append("userId", action$.payload.userId);
          serverData.append("productId", action$.payload.productId);
          serverData.append("templateId", action$.payload.templateId);

          axios
            .post(LOAD_PROJ, serverData)
            .then(resp => resp.data)
            .then(data => {
              console.log(data, "DATA");
              if (data.status !== "failure") {
                obs.next({
                  type: PROJ_LOAD_SUCCESS,
                  data: data.data
                });
              } else {
                obs.next({
                  type: PROJ_LOAD_FAILED,
                  payload: data.error_message
                });
              }
              obs.complete();
            })
            .catch(error => {
              obs.next({
                type: PROJ_LOAD_FAILED,
                payload: "Error message: " + error.message
              });
              obs.complete();
            });
        })
      )
    )
};
