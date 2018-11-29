const {
  DAG_UPLOAD_IMAGE,
  DAG_UPLOAD_IMAGE_SUCCESS,
  DAG_UPLOAD_IMAGE_FAILED,
  DAG_SIGNIN_START,
  DAG_SIGNIN_SUCCESS,
  DAG_SIGNIN_FAILED
} = require("../actionTypes/designAndGo");
const axios = require("axios");

const { Observable } = require("rxjs");
const { mapTo, map, mergeMap } = require("rxjs/operators");
const { ofType } = require("redux-observable");

const URL = "http://work.cloudlab.at:9012/ig/designAndGoUpload/upload.php";
const LOGIN_URL = "http://work.cloudlab.at:9012/ig/designAndGoUpload/login.php";

module.exports = {
  //export default {
  onEpicDesignAngGo: (action$, state$) =>
    action$.pipe(
      ofType(DAG_UPLOAD_IMAGE),
      mergeMap(action$ =>
        Observable.create(obs => {
          console.log("Sssss");
          let serverData = new FormData();
          serverData.append("fileToUpload", action$.payload.image);
          axios
            .post(URL, serverData)
            .then(resp => resp.data)
            .then(data => {
              if (data.status !== "failure") {
                obs.next({
                  type: DAG_UPLOAD_IMAGE_SUCCESS,
                  payload: data.file_path
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
    )
};
