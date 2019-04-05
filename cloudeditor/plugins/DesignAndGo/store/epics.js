const {
  DAG_UPLOAD_IMAGE,
  DAG_UPLOAD_IMAGE_SUCCESS,
  DAG_UPLOAD_IMAGE_FAILED,
  DAG_SIGNIN_START,
  DAG_SIGNIN_SUCCESS,
  DAG_SIGNIN_FAILED
} = require("./actionTypes/designAndGo");

const { dagChangeRenderId } = require("./actions");
const axios = require("axios");

const { Observable, of, concat } = require("rxjs");
const { mergeMap, switchMap, flatMap, mapTo, map } = require("rxjs/operators");
const { ofType } = require("redux-observable");

const { pick } = require("ramda");

const ConfigUtils = require("../../../core/utils/ConfigUtils");
const config = ConfigUtils.getDefaults();

const {
  CHANGE_VARIABLE_VALUE,
  UPDATE_OBJ_FROM_VARIABLE,
  CHECK_VARIABLE_VALID,
  CHANGE_COLOR_VARIABLE_VALUE,
  UPDATE_OBJ_COLOR_FROM_VARIABLE,
  UPDATE_OBJ_IMAGE_FROM_VARIABLE
} = require("../../../core/stores/actionTypes/variables");

const URL = config.baseUrl + "/cloudeditor/uploadImage";
// ("http://work.cloudlab.at:9012/ig/avery-external/public/");
const LOGIN_URL = config.baseUrl + "/login";

module.exports = {
  //export default {
  onEpicDesignAngGo: (action$, state$) =>
    action$.pipe(
      ofType(DAG_UPLOAD_IMAGE),
      mergeMap(action$ =>
        Observable.create(obs => {
          let serverData = new FormData();
          serverData.append("qqfile", action$.payload.image);
          axios
            .post(URL, serverData)
            .then(resp => resp.data)
            .then(data => {
              if (data.status !== "failure") {
                obs.next({
                  type: DAG_UPLOAD_IMAGE_SUCCESS,
                  payload: {
                    image_src: data.image_src,
                    imageHeight: data.imageHeight,
                    imageWidth: data.imageWidth
                  }
                });
              } else {
                obs.next({
                  type: DAG_UPLOAD_IMAGE_FAILED,
                  payload: data.error_message
                });
              }
              obs.complete();
            })
            .catch(error => {
              console.log(error, "ERROR");
              obs.next({
                type: DAG_UPLOAD_IMAGE_FAILED,
                payload: "Error message: " + error.message
              });
              obs.complete();
            });
        })
      )
    ),
  onEpicLogin: (action$, state$) =>
    action$.pipe(
      ofType(DAG_SIGNIN_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let serverData = new FormData();
          serverData.append("email", action$.payload.email);
          serverData.append("password", action$.payload.password);
          axios
            .post(LOGIN_URL, serverData)
            .then(resp => resp.data)
            .then(data => {
              if (data.status !== "failure") {
                obs.next({
                  type: DAG_SIGNIN_SUCCESS,
                  email: action$.payload.email,
                  password: action$.payload.password
                });
              } else {
                obs.next({
                  type: DAG_SIGNIN_FAILED,
                  payload: data.error_message
                });
              }
              obs.complete();
            })
            .catch(error => {
              console.log(error, "ERROR");
              obs.next({
                type: DAG_SIGNIN_FAILED,
                payload: "Error message: " + error.message
              });
              obs.complete();
            });
        })
      )
    ),
  onObjectsReadyEpic: (action$, state$) =>
    action$.pipe(
      ofType("OBJECTS_READY"),
      switchMap(action$ => {
        return of(dagChangeRenderId());
      })
    ),
  onVariableChange: (action$, state$) =>
    action$.pipe(
      ofType(CHANGE_VARIABLE_VALUE),
      switchMap(action$ => {
        return of({
          type: UPDATE_OBJ_FROM_VARIABLE,
          payload: {
            variables: state$.value.variables.variables,
            variable: state$.value.variables.variables[action$.payload.name]
          }
        });
      })
    ),
  onVariableColorChange: (action$, state$) =>
    action$.pipe(
      ofType(CHANGE_COLOR_VARIABLE_VALUE),
      switchMap(action$ => {
        return of({
          type: UPDATE_OBJ_COLOR_FROM_VARIABLE,
          payload: {
            variables: pick(
              ["color1", "color2", "color3"],
              state$.value.variables.variables
            )
          }
        });
      })
    ),
  onVariableImageChange: (action$, state$) =>
    action$.pipe(
      ofType(DAG_UPLOAD_IMAGE_SUCCESS),
      switchMap(action$ => {
        return of({
          type: UPDATE_OBJ_IMAGE_FROM_VARIABLE,
          payload: {
            variables: pick(["userImage"], state$.value.variables.variables)
          }
        });
      })
    ),
  onValidateVariable: (action$, state$) =>
    action$.pipe(
      ofType(UPDATE_OBJ_FROM_VARIABLE),
      switchMap(action$ => {
        return of({
          type: CHECK_VARIABLE_VALID,
          payload: {
            objects: state$.value.project.objects,
            variable: action$.payload.variable
          }
        });
      })
    )
};
