const { mapTo } = require("rxjs/operators");
const { ofType } = require("redux-observable");
const { mergeMap } = require("rxjs/operators");
const axios = require("../../axios/project/axios");
const qs = require("qs");
const { Observable } = require("rxjs");
const { actions } = require("@intactile/redux-undo-redo");
const ConfigUtils = require("../../../core/utils/ConfigUtils");

const { CHANGE_OPTIONS } = require("../actionTypes/productInformation");
const {
  START_GLOBAL_LOADING,
  STOP_GLOBAL_LOADING
} = require("../actionTypes/globalLoading");
const {
  START_CHANGE_PRINT_OPTIONS,
  STOP_CHANGE_PRINT_OPTIONS
} = require("../actionTypes/productInformation");
const CALCULATE_PRICE_URL =
  ConfigUtils.getConfigProp("baseUrl") +
  "webproduct/printoption/changeOptions/";

const changeOptions = (serverData, obs) => {
  obs.next({
    type: START_GLOBAL_LOADING
  });
  axios
    .post(CALCULATE_PRICE_URL, qs.stringify(serverData))
    .then(resp => resp.data)
    .then(data => {
      if (data) {
        obs.next({
          type: CALCULATE_PRICE,
          total_price: data.total_gross_price,
          print_options: serverData.print_options
        });
      }
      obs.next({
        type: STOP_GLOBAL_LOADING
      });
      obs.complete();
    })
    .catch(error => {
      obs.next({
        type: STOP_GLOBAL_LOADING
      });
      obs.complete();
    });
};
module.exports = {
  onEpicStartChangeOptions: (action$, state$) =>
    action$.pipe(
      ofType(START_CHANGE_PRINT_OPTIONS),
      mergeMap(action$ =>
        Observable.create(obs => {
          const productInformation = { ...state$.value.productInformation };
          let print_options = {
            ...productInformation.productOptions.print_options
          };
          const pp_code = action$.payload.pp_code;
          const po_code = action$.payload.po_code;
          const po_value = action$.payload.po_value;
          print_options[pp_code][po_code] = [po_value];
          const serverData = {
            product: productInformation.productId,
            related_product: false,
            qty: productInformation.qty,
            print_options: print_options,
            options: productInformation.productOptions.options
          };
          obs.next({
            type: START_GLOBAL_LOADING
          });
          setTimeout(function() {
            obs.next({
              type: STOP_GLOBAL_LOADING
            });
            obs.next({
              type: STOP_CHANGE_PRINT_OPTIONS,
              payload: {
                print_options
              }
            });
          }, 1000);
          // calculatePrice(serverData, obs);
        })
      )
    )
};
