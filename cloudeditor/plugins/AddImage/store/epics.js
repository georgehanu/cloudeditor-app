const {
  UPLOAD_IMAGE_START,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAILED
} = require("./actionTypes");
const axios = require("axios");

const { Observable } = require("rxjs");
const { mapTo, map, mergeMap } = require("rxjs/operators");
const { ofType } = require("redux-observable");

const URL = "http://work.cloudlab.at:9012/pa/asgard/public/api/editor/upload";

module.exports = {
  onEpicImage: (action$, state$) =>
    action$.pipe(
      ofType(UPLOAD_IMAGE_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let oneFile = 0;
          for (oneFile = 0; oneFile < action$.payload.length; oneFile++) {
            let serverData = new FormData();
            serverData.append("file", action$.payload[oneFile]);
            axios
              .post(URL, serverData)
              .then(resp => resp.data)
              .then(data => {
                if (data.status !== "failure") {
                  obs.next({
                    type: UPLOAD_IMAGE_SUCCESS,
                    payload: data.file_path
                  });
                } else {
                  obs.next({
                    type: UPLOAD_IMAGE_FAILED,
                    payload: data.error_message
                  });
                  obs.complete();
                }
              })
              .catch(error => {
                obs.next({
                  type: UPLOAD_IMAGE_FAILED,
                  payload: "Error message: " + error.message
                });
                obs.complete();
              });
          }
        })
      )
    )
};
