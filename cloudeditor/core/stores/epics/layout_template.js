const { ofType } = require("redux-observable");
const { mergeMap } = require("rxjs/operators");
const axios = require("axios");
const { Observable } = require("rxjs");
const {
  SAVE_LAYOUT_TEMPLATE_START,
  SAVE_LAYOUT_TEMPLATE_FAILED,
  SAVE_LAYOUT_TEMPLATE_SUCCESS,
  SAVE_ICON_TEMPLATE_START,
  SAVE_ICON_TEMPLATE_FAILED,
  SAVE_ICON_TEMPLATE_SUCCESS
} = require("../actionTypes/layout_template");

const SAVE_LAYOUT_URL =
  "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/personalize/cloudeditorlayout/saveProject";

const STORE_ICON_URL =
  "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/personalize/cloudeditorlayout/uploadProjectIcon";

module.exports = {
  onEpicSaveLayout: (action$, state$) =>
    action$.pipe(
      ofType(SAVE_LAYOUT_TEMPLATE_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let formData = new FormData();
          for (var key in action$.payload) {
            formData.append(key, action$.payload[key]);
          }
          axios
            .post(SAVE_LAYOUT_URL, formData)
            .then(resp => resp.data)
            .then(data => {
              //console.log(data, "d");
              if (data.success) {
                obs.next({
                  type: SAVE_LAYOUT_TEMPLATE_SUCCESS
                });
              } else {
                obs.next({
                  type: SAVE_LAYOUT_TEMPLATE_FAILED,
                  payload: "Error saving template"
                });
              }
              obs.complete();
            })
            .catch(error => {
              obs.next({
                type: SAVE_LAYOUT_TEMPLATE_FAILED,
                payload: "Error message: " + error.message
              });
              obs.complete();
            });
        })
      )
    ),
  onEpicSaveIconLayout: (action$, state$) =>
    action$.pipe(
      ofType(SAVE_ICON_TEMPLATE_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let formData = new FormData();
          for (var key in action$.payload) {
            formData.append(key, action$.payload[key]);
          }
          axios
            .post(STORE_ICON_URL, formData)
            .then(resp => resp.data)
            .then(data => {
              if (data.success) {
                obs.next({
                  type: SAVE_ICON_TEMPLATE_SUCCESS,
                  projectIcon: data.fileName,
                  projectIconSrc: data.fileSrc
                });
              } else {
                obs.next({
                  type: SAVE_ICON_TEMPLATE_FAILED,
                  payload: "Error uploading icon template"
                });
              }
              obs.complete();
            })
            .catch(error => {
              obs.next({
                type: SAVE_ICON_TEMPLATE_FAILED,
                payload: "Error message: " + error.message
              });
              obs.complete();
            });
        })
      )
    )
};
