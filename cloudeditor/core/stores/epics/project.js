const { mapTo } = require("rxjs/operators");
const { ofType } = require("redux-observable");
const { mergeMap } = require("rxjs/operators");
const axios = require("../../axios/project/axios");
const qs = require("qs");
const { Observable } = require("rxjs");
const { actions } = require("@intactile/redux-undo-redo");

const { rerenderPage } = require("../../../core/utils/UtilUtils");
const ConfigUtils = require("../../../core/utils/ConfigUtils");
const { ADD_IMAGE_FROM_BUTTON } = require("../actionTypes/addButton");
const {
  CHANGE_PAGE,
  PROJ_SAVE_START,
  PROJ_SAVE_SUCCESS,
  PROJ_SAVE_FAILED,
  PROJ_LOAD_START,
  PROJ_LOAD_SUCCESS,
  PROJ_LOAD_FAILED,
  PROJ_LOAD_DELETE_START,
  PROJ_LOAD_DELETE_SUCCESS,
  PROJ_LOAD_DELETE_FAILED,
  PROJ_LOAD_PROJECT_START,
  PROJ_LOAD_PROJECT_SUCCESS,
  PROJ_LOAD_PROJECT_FAILED,
  ADD_PAGES,
  DELETE_PAGE,
  PROJ_SHOW_POPUP
} = require("../actionTypes/project");
const { CHANGE_OPTIONS } = require("../actionTypes/productInformation");
const {
  START_GLOBAL_LOADING,
  STOP_GLOBAL_LOADING
} = require("../actionTypes/globalLoading");
const { CALCULATE_PRICE } = require("../actionTypes/productInformation");

const SAVE_PROJ = "/personalize/cloudeditorprojects/save";
const LOAD_PROJ = "/personalize/cloudeditorprojects/getAllProjects";
const DELETE_PROJ = "/personalize/cloudeditorprojects/deleteProject";
const LOAD_ONE_PROJ = "/personalize/cloudeditorprojects/loadProject";

const CALCULATE_PRICE_URL =
  ConfigUtils.getConfigProp("baseUrl") +
  "webproduct/printoption/changeOptions/";

const dispachEvent = () => {
  setTimeout(() => {
    // rerenderPage();
  }, 0);
};
const calculatePrice = (serverData, obs) => {
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
  onEpic: (action$, state$) =>
    action$.pipe(
      ofType("ADD_OBJECT_TO_PAGE"),
      mapTo({ type: ADD_IMAGE_FROM_BUTTON, title: state$.value.project.title })
    ),
  onChangePage: (action$, state$) =>
    action$.pipe(
      ofType("CHANGE_PAGE"),
      mapTo(dispachEvent)
    ),

  onEpicSave: (action$, state$) =>
    action$.pipe(
      ofType(PROJ_SAVE_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let serverData = new FormData();
          serverData.append("name", action$.payload.name);
          serverData.append("description", action$.payload.description);
          serverData.append("overwrite", action$.payload.overwrite);
          serverData.append("projectId", state$.value.project.projectId);
          serverData.append(
            "template_id",
            state$.value.productInformation.templateId
          );
          serverData.append(
            "product_id",
            state$.value.productInformation.productId
          );
          serverData.append(
            "projectData",
            JSON.stringify({
              pages: state$.value.project.pages,
              pagesOrder: state$.value.project.pagesOrder,
              objects: state$.value.project.objects,
              header: state$.value.project.configs.document.header,
              footer: state$.value.project.configs.document.footer
            })
          );
          axios
            .post(SAVE_PROJ, serverData)
            .then(resp => resp.data)
            .then(data => {
              if (data.success) {
                obs.next({
                  type: PROJ_SAVE_SUCCESS,
                  name: action$.payload.name,
                  description: action$.payload.description,
                  projectId: data.projectId,
                  message: data.message
                });
                var event = new Event("resizePage");
                window.dispatchEvent(event);
              } else {
                if (data.overwrite) {
                  obs.next({
                    type: PROJ_SHOW_POPUP,
                    payload: "Error message: " + data.message
                  });
                } else {
                  obs.next({
                    type: PROJ_SAVE_FAILED,
                    payload: data.message
                  });
                }
              }
              obs.complete();
            })
            .catch(error => {
              obs.next({
                type: PROJ_SAVE_FAILED,
                payload: "Error message: " + error.message
              });
              obs.complete();
            });
        })
      )
    ),

  onEpicLoad: (action$, state$) =>
    action$.pipe(
      ofType(PROJ_LOAD_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let serverData = new FormData();
          serverData.append(
            "product_id",
            state$.value.productInformation.productId
          );
          serverData.append(
            "template_id",
            state$.value.productInformation.templateId
          );
          axios
            .post(LOAD_PROJ, serverData)
            .then(resp => resp.data)
            .then(data => {
              if (data.success) {
                obs.next({
                  type: PROJ_LOAD_SUCCESS,
                  data: data.projects
                });
              } else {
                obs.next({
                  type: PROJ_LOAD_FAILED,
                  payload: data.message
                });
              }
              obs.complete();
            })
            .catch(error => {
              obs.next({
                type: PROJ_LOAD_FAILED,
                payload: "Error message: " + error.message
              });
              obs.complete();
            });
        })
      )
    ),

  onEpicDelete: (action$, state$) =>
    action$.pipe(
      ofType(PROJ_LOAD_DELETE_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let serverData = new FormData();
          serverData.append("projectId", action$.payload.projectId);
          serverData.append("productId", action$.payload.productId);

          axios
            .post(DELETE_PROJ, serverData)
            .then(resp => resp.data)
            .then(data => {
              if (data.success) {
                obs.next({
                  type: PROJ_LOAD_DELETE_SUCCESS,
                  projectId: action$.payload.projectId
                });
              } else {
                obs.next({
                  type: PROJ_LOAD_DELETE_FAILED,
                  payload: data.message
                });
              }
              obs.complete();
            })
            .catch(error => {
              obs.next({
                type: PROJ_LOAD_DELETE_FAILED,
                payload: "Error message: " + error.message
              });
              obs.complete();
            });
        })
      )
    ),

  onEpicLoadOneProject: (action$, state$) =>
    action$.pipe(
      ofType(PROJ_LOAD_PROJECT_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let serverData = new FormData();
          serverData.append("projectId", action$.payload.projectId);
          serverData.append("productId", action$.payload.productId);

          axios
            .post(LOAD_ONE_PROJ, serverData)
            .then(resp => resp.data)
            .then(data => {
              if (data.success) {
                obs.next({
                  type: PROJ_LOAD_PROJECT_SUCCESS,
                  data: data.project,
                  projectId: action$.payload.projectId
                });
                const clear = actions.clear();
                obs.next({
                  ...clear
                });
              } else {
                obs.next({
                  type: PROJ_LOAD_PROJECT_FAILED,
                  payload: data.message
                });
              }
              obs.complete();
            })
            .catch(error => {
              obs.next({
                type: PROJ_LOAD_PROJECT_FAILED,
                payload: "Error message: " + error.message
              });
              obs.complete();
            });
        })
      )
    ),

  onEpiceCalculatePrice: (action$, state$) =>
    action$.pipe(
      ofType(ADD_PAGES),
      mergeMap(action$ =>
        Observable.create(obs => {
          const productInformation = { ...state$.value.productInformation };
          let print_options = {
            ...productInformation.productOptions.print_options
          };
          const contentCode = productInformation.contentCode;
          const coverCode = productInformation.coverCode;
          const numberOfPages = state$.value.project.pagesOrder.length;
          const no_page_cover = state$.value.productInformation.no_page_cover;
          const pages_codes = state$.value.productInformation.pages_codes;
          const contentPages = numberOfPages - parseInt(no_page_cover);
          if (contentCode) {
            let page_code = "pages" + contentPages;
            if (pages_codes.hasOwnProperty(contentPages)) {
              page_code = pages_codes[contentPages];
            }
            print_options[contentCode]["pages"][0] = page_code;
          }
          const serverData = {
            product: productInformation.productId,
            related_product: false,
            qty: productInformation.qty,
            print_options: print_options,
            options: productInformation.productOptions.options
          };
          calculatePrice(serverData, obs);
        })
      )
    ),
  onEpiceChangeOptionsPrice: (action$, state$) =>
    action$.pipe(
      ofType(CHANGE_OPTIONS),
      mergeMap(action$ =>
        Observable.create(obs => {
          const productInformation = { ...state$.value.productInformation };
          let print_options = {
            ...productInformation.productOptions.print_options
          };
          const serverData = {
            product: productInformation.productId,
            related_product: false,
            qty: productInformation.qty,
            print_options: print_options,
            options: productInformation.productOptions.options
          };
          calculatePrice(serverData, obs);
        })
      )
    ),
  onEpiceDeleteCalculatePrice: (action$, state$) =>
    action$.pipe(
      ofType(DELETE_PAGE),
      mergeMap(action$ =>
        Observable.create(obs => {
          const productInformation = { ...state$.value.productInformation };

          let print_options = {
            ...productInformation.productOptions.print_options
          };
          const contentCode = productInformation.contentCode;
          const coverCode = productInformation.coverCode;
          const numberOfPages = state$.value.project.pagesOrder.length;
          const no_page_cover = state$.value.productInformation.no_page_cover;
          const pages_codes = state$.value.productInformation.pages_codes;
          const contentPages = numberOfPages - parseInt(no_page_cover);
          if (contentCode) {
            let page_code = "pages" + contentPages;
            if (pages_codes.hasOwnProperty(contentPages)) {
              page_code = pages_codes[contentPages];
            }
            print_options[contentCode]["pages"][0] = page_code;
          }

          const serverData = {
            product: productInformation.productId,
            related_product: false,
            qty: productInformation.qty,
            print_options: print_options,
            options: productInformation.productOptions.options
          };
          calculatePrice(serverData, obs);
        })
      )
    )
};
