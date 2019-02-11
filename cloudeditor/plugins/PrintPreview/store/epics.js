const {
  PREVIEW_LOAD_PAGE,
  PREVIEW_GET_PAGE,
  PREVIEW_LOAD_PAGE_SUCCESS,
  PREVIEW_LOAD_PAGE_FAILED,
  ATTACH_PREVIEW
} = require("./actionTypes");
const axios = require("../../../core/axios/project/axios");
const qs = require("qs");
const { Observable } = require("rxjs");
const { mergeMap } = require("rxjs/operators");
const { ofType } = require("redux-observable");
const { head, forEachObjIndexed, findIndex } = require("ramda");

const PRINT_PREVIEW_URL = "/personalize/index/previewCloudeditor";
const PRINT_GET_PAGE_URL = "/personalize/index/getPageCloudeditor";
const ATTACH_URL = "/personalize/index/attachCloudEditor";

const getPage = (state$, obs, payload) => {
  const index = state$.value.project.pagesOrder.indexOf(payload.page_id);
  let imageUrls = { ...state$.value.preview.imageUrls };
  let pageUrl = "";
  if (typeof imageUrls[index] !== "undefined") {
    pageUrl = imageUrls[index];
    obs.next({
      type: PREVIEW_LOAD_PAGE_SUCCESS,
      payload: {
        imageUrls,
        pageUrl
      }
    });
    return false;
  }
  const serverData = {
    page: index + 1,
    productId: state$.value.productInformation.productId,
    templateId: state$.value.productInformation.templateId,
    selection: state$.value.selection
  };
  axios
    .post(PRINT_GET_PAGE_URL, qs.stringify(serverData))
    .then(resp => resp.data)
    .then(data => {
      if (data.success) {
        if (Array.isArray(data.data.image)) {
          imageUrls = data.data.image;
          pageUrl = data.data.image[index];
        } else {
          pageUrl = data.data.image;
          imageUrls[index] = data.data.image;
        }
        obs.next({
          type: PREVIEW_LOAD_PAGE_SUCCESS,
          payload: {
            imageUrls,
            pageUrl
          }
        });
      } else {
        obs.next({
          type: PREVIEW_LOAD_PAGE_FAILED,
          payload: data.message
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
};
const getPreview = (state$, obs) => {
  const project = {
    pages: { ...state$.value.project.pages },
    objects: { ...state$.value.project.objects },
    pagesOrder: { ...state$.value.project.pagesOrder },
    configs: {
      ...state$.value.project.configs.document,
      objects: { ...state$.value.project.configs.objects }
    },
    fontsLoadUrl:
      "https://stadionzeitung02.bestinprint.de/personalize/index/loadFonts/id/" +
      state$.value.productInformation.templateId
  };
  const serverData = {
    project,
    productId: state$.value.productInformation.productId,
    templateId: state$.value.productInformation.templateId,
    selection: state$.value.selection,
    fonts: state$.value.ui.fonts
  };
  axios
    .post(PRINT_PREVIEW_URL, qs.stringify(serverData))
    .then(resp => resp.data)
    .then(data => {
      if (data.success) {
        let imageUrls = { ...state$.value.preview.imageUrls };
        let pageUrl = "";
        if (Array.isArray(data.data.image)) {
          imageUrls = data.data.image;
          pageUrl = head(data.data.image);
        } else {
          pageUrl = data.data.image;
          imageUrls[0] = data.data.image;
        }
        obs.next({
          type: PREVIEW_LOAD_PAGE_SUCCESS,
          payload: {
            imageUrls,
            pageUrl
          }
        });
      } else {
        obs.next({
          type: PREVIEW_LOAD_PAGE_FAILED,
          payload: data.message
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
};

module.exports = {
  onEpicPreview: (action$, state$) =>
    action$.pipe(
      ofType(PREVIEW_LOAD_PAGE),
      mergeMap(action$ =>
        Observable.create(obs => {
          const { payload } = action$;
          if (!Object.keys(state$.value.preview.imageUrls).length) {
            getPreview(state$, obs);
          } else {
            getPage(state$, obs, payload);
          }
        })
      )
    ),
  onEpicAttach: (action$, state$) =>
    action$.pipe(
      ofType(ATTACH_PREVIEW),
      mergeMap(action$ =>
        Observable.create(obs => {
          const project = {
            pages: { ...state$.value.project.pages },
            objects: { ...state$.value.project.objects },
            pagesOrder: { ...state$.value.project.pagesOrder },
            configs: {
              ...state$.value.project.configs.document,
              objects: { ...state$.value.project.configs.objects }
            },
            fontsLoadUrl:
              "https://stadionzeitung02.bestinprint.de/personalize/index/loadFonts/id/" +
              state$.value.productInformation.templateId
          };
          const serverData = {
            project,
            productId: state$.value.productInformation.productId,
            templateId: state$.value.productInformation.templateId,
            productInformation: state$.value.productInformation,
            selection: state$.value.selection,
            fonts: state$.value.ui.fonts,
            preview: state$.value.preview.imageUrls[0]
          };
          axios
            .post(ATTACH_URL, qs.stringify(serverData))
            .then(resp => resp.data)
            .then(data => {
              if (data.success) {
                window.location = data.cartUrl;
              } else {
                obs.next({
                  type: PREVIEW_LOAD_PAGE_FAILED,
                  payload: data.message
                });
              }
              obs.complete();
            })
            .catch(error => {
              obs.next({
                type: PREVIEW_LOAD_PAGE_FAILED,
                payload: data.message
              });
              obs.complete();
            });
        })
      )
    )
};
