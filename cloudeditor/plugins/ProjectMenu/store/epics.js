const {
  AUTH_SIGNIN_START,
  AUTH_SIGNIN_SUCCESS,
  AUTH_SIGNIN_FAILED,
  AUTH_REGISTER_START
} = require("./actionTypes");
const axios = require("../../../core/axios/project/axios");

const { Observable } = require("rxjs");
const { mapTo, map, mergeMap } = require("rxjs/operators");
const { ofType } = require("redux-observable");

const LOGIN_URL = "/personalize/cloudeditor/logincustomer";
const REGISTER_URL = "/personalize/index/registerCustomer";

module.exports = {
  onEpicLogin: (action$, state$) =>
    action$.pipe(
      ofType(AUTH_SIGNIN_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let serverData = new FormData();
          serverData.append("email", action$.payload.email);
          serverData.append("password", action$.payload.password);
          axios
            .post(LOGIN_URL, serverData)
            .then(resp => resp.data)
            .then(data => {
              if (data.success) {
                obs.next({
                  type: AUTH_SIGNIN_SUCCESS,
                  email: action$.payload.email,
                  password: action$.payload.password
                });
              } else {
                obs.next({
                  type: AUTH_SIGNIN_FAILED,
                  payload: data.message
                });
              }
              obs.complete();
            })
            .catch(error => {
              obs.next({
                type: AUTH_SIGNIN_FAILED,
                payload: "Error message: " + error.message
              });
              obs.complete();
            });
        })
      )
    ),
  onEpicRegister: (action$, state$) =>
    action$.pipe(
      ofType(AUTH_REGISTER_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let serverData = new FormData();
          serverData.append("email", action$.payload.email);
          serverData.append("password", action$.payload.password);
          serverData.append("prefix", action$.payload.prefix);
          serverData.append("sufix", action$.payload.sufix);
          serverData.append("lastname", action$.payload.lastname);
          serverData.append("firstname", action$.payload.firstname);
          serverData.append("confirmation", action$.payload.confirmation);
          serverData.append("is_subscribed", action$.payload.is_subscribed);
          axios
            .post(REGISTER_URL, serverData)
            .then(resp => resp.data)
            .then(data => {
              if (data.success) {
                obs.next({
                  type: AUTH_SIGNIN_SUCCESS,
                  email: action$.payload.email,
                  password: action$.payload.password
                });
              } else {
                obs.next({
                  type: AUTH_SIGNIN_FAILED,
                  payload: data.message
                });
              }
              obs.complete();
            })
            .catch(error => {
              obs.next({
                type: AUTH_SIGNIN_FAILED,
                payload: "Error message: " + error.message
              });
              obs.complete();
            });
        })
      )
    )
};
