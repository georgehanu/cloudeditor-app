const {
  PREVIEW_LOAD_PAGE,
  PREVIEW_LOAD_PAGE_SUCCESS,
  PREVIEW_LOAD_PAGE_FAILED
} = require("./actionTypes");
const axios = require("axios");
const qs = require("qs");
const { Observable } = require("rxjs");
const { mergeMap } = require("rxjs/operators");
const { ofType } = require("redux-observable");
const { head } = require("ramda");

const PRINT_PREVIEW_URL =
  "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/personalize/index/previewCloudeditor";

module.exports = {
  onEpicPreview: (action$, state$) =>
    action$.pipe(
      ofType(PREVIEW_LOAD_PAGE),
      mergeMap(action$ =>
        Observable.create(obs => {
          const serverData = {
            project: { ...state$.value.project },
            selection: state$.value.selection
          };
          axios
            .post(PRINT_PREVIEW_URL, qs.stringify(serverData))
            .then(resp => resp.data)
            .then(data => {
              if (data.status === "success") {
                obs.next({
                  type: PREVIEW_LOAD_PAGE_SUCCESS,
                  payload: head(data.images)
                });
              } else {
                obs.next({
                  type: PREVIEW_LOAD_PAGE_FAILED,
                  payload: data.error_message
                });
              }
              obs.complete();
            })
            .catch(error => {
              obs.next({
                type: PREVIEW_LOAD_PAGE_FAILED,
                payload: "Error message: " + error.message
              });
              obs.complete();
            });
        })
      )
    )
};
