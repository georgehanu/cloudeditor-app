const {
  UPLOAD_ASSET_SUCCESS,
  UPLOAD_ASSET_FAILED,
  ASSETS_LAYOUT_START,
  ASSETS_LAYOUT_SUCCESS,
  ASSETS_LAYOUT_FAILED,
  REMOVE_ASSET_FROM_GALLERY_START,
  REMOVE_ASSET_FROM_GALLERY_FAILED,
  REMOVE_ASSET_FROM_GALLERY_SUCCESS
} = require("../actionTypes/assets");
const axios = require("../../axios/project/axios");

const { Observable } = require("rxjs");
const { mergeMap } = require("rxjs/operators");
const { ofType } = require("redux-observable");

const URL = "/personalize/index/editorUpload";
const REMOVE_ASSET_URL = "/personalize/cloudeditor/deleteAsset";

module.exports = {
  onEpicFile: (action$, state$) =>
    action$.pipe(
      ofType("UPLOAD_ASSET_START"),
      mergeMap(action$ =>
        Observable.create(obs => {
          let oneFile = 0;
          for (oneFile = 0; oneFile < action$.payload.files.length; oneFile++) {
            let serverData = new FormData();
            serverData.append("file", action$.payload.files[oneFile]);
            axios
              .post(URL, serverData)
              .then(resp => resp.data)
              .then(data => {
                if (data.success) {
                  obs.next({
                    type: UPLOAD_ASSET_SUCCESS,
                    payload: {
                      type: action$.payload.type,
                      data: data.data
                    }
                  });
                } else {
                  obs.next({
                    type: UPLOAD_ASSET_FAILED,
                    payload: {
                      type: action$.payload.type,
                      message: data.message
                    }
                  });
                  obs.complete();
                }
              })
              .catch(error => {
                obs.next({
                  type: UPLOAD_ASSET_FAILED,
                  payload: {
                    type: action$.payload.type,
                    message: "Error message: " + error.message
                  }
                });
                obs.complete();
              });
          }
        })
      )
    ),
  onEpicDeleteAsset: (action$, state$) =>
    action$.pipe(
      ofType(REMOVE_ASSET_FROM_GALLERY_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let serverData = new FormData();
          serverData.append("id", action$.payload.id);
          serverData.append("type", action$.payload.type);

          axios
            .post(REMOVE_ASSET_URL, serverData)
            .then(resp => resp.data)
            .then(data => {
              if (data.success) {
                obs.next({
                  type: REMOVE_ASSET_FROM_GALLERY_SUCCESS,
                  payload: {
                    id: action$.payload.id,
                    type: action$.payload.type,
                    fromToolbar: action$.payload.fromToolbar
                  }
                });
              } else {
                obs.next({
                  type: REMOVE_ASSET_FROM_GALLERY_FAILED,
                  payload: {
                    message: data.message,
                    fromToolbar: action$.payload.fromToolbar
                  }
                });
                obs.complete();
              }
            })
            .catch(error => {
              obs.next({
                type: REMOVE_ASSET_FROM_GALLERY_FAILED,
                payload: {
                  message: "Error message: " + error.message,
                  fromToolbar: action$.payload.fromToolbar
                }
              });
              obs.complete();
            });
        })
      )
    )
};
