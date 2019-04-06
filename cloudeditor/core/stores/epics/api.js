const { mapTo } = require("rxjs/operators");
const { ofType } = require("redux-observable");
const { mergeMap } = require("rxjs/operators");
const axios = require("../../axios/project/axios");
const qs = require("qs");
const { Observable } = require("rxjs");

const { CHANGE_OPTIONS } = require("../actionTypes/productInformation");
const { without, clone, findIndex } = require("ramda");

const {
  CHANGE_SEARCH_CRITERIA,
  CHANGE_ITEMS
} = require("../../../plugins/Lpf/Lpf/store/actionTypes/imageApi");
const {
  START_GLOBAL_LOADING,
  STOP_GLOBAL_LOADING
} = require("../../../core/stores/actionTypes/globalLoading");
module.exports = {
  onEpicStartChangeOptions: (action$, state$) =>
    action$.pipe(
      ofType(CHANGE_SEARCH_CRITERIA),
      mergeMap(action$ =>
        Observable.create(obs => {
          const { api_code } = action$.payload;
          const apiData = state$.value.imageApi.items[api_code];
          let formData = new FormData();
          formData.append("tags", apiData.tags);
          formData.append("perPage", apiData.perPage);
          formData.append("category", apiData.category);
          formData.append("page", parseInt(apiData.page) + 1);
          const URL = apiData.fetch_url;
          obs.next({
            type: START_GLOBAL_LOADING
          });
          axios
            .post(URL, formData)
            .then(resp => resp.data)
            .then(data => {
              obs.next({
                type: STOP_GLOBAL_LOADING
              });
              if (data.success)
                obs.next({
                  type: CHANGE_ITEMS,
                  payload: {
                    api_code,
                    props: {
                      images: data.items,
                      totalItems: data.totalItems
                    }
                  }
                });
            });
          // calculatePrice(serverData, obs);
        })
      )
    )
};
