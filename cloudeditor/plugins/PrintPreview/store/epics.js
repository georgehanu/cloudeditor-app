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

const PRINT_PREVIEW_URL =
  "http://work.cloudlab.at:9012/ig/tests/printPreview.php";

module.exports = {
  onEpicPreview: (action$, state$) =>
    action$.pipe(
      ofType(PREVIEW_LOAD_PAGE),
      mergeMap(action$ =>
        Observable.create(obs => {
          const serverData = { pageNo: action$.payload };
          axios
            .post(PRINT_PREVIEW_URL, qs.stringify(serverData))
            .then(resp => resp.data)
            .then(data => {
              if (data.status === "success") {
                obs.next({
                  type: PREVIEW_LOAD_PAGE_SUCCESS,
                  payload: data.page
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
