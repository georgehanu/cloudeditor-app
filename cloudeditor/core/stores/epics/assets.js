const {
  UPLOAD_ASSET_SUCCESS,
  UPLOAD_ASSET_FAILED
} = require("../actionTypes/assets");
const axios = require("axios");

const { Observable } = require("rxjs");
const { mergeMap } = require("rxjs/operators");
const { ofType } = require("redux-observable");

const URL = "http://work.cloudlab.at:9012/pa/asgard/public/api/editor/upload";

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
                if (data.status !== "failure") {
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
                    payload: { message: data.error_message }
                  });
                  obs.complete();
                }
              })
              .catch(error => {
                obs.next({
                  type: UPLOAD_ASSET_FAILED,
                  payload: { message: "Error message: " + error.message }
                });
                obs.complete();
              });
          }
        })
      )
    )
};
