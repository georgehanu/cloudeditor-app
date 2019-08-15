const {
  PREVIEW_LOAD_PAGE,
  PREVIEW_GET_PAGE,
  PREVIEW_LOAD_PAGE_SUCCESS,
  PREVIEW_LOAD_PAGE_FAILED,
  ATTACH_PREVIEW,
  COMPLETE_PERSONALIZATION
} = require("./actionTypes");
const {
  CHANGE_PAGE
} = require("../../../../../core/stores/actionTypes/project");
const axios = require("../../../../../core/axios/project/axios");
const qs = require("qs");
const { Observable } = require("rxjs");
const { mergeMap } = require("rxjs/operators");
const { ofType } = require("redux-observable");
const { head, forEachObjIndexed, findIndex, pick } = require("ramda");

const ConfigUtils = require("../../../../../core/utils/ConfigUtils");

const {
  createProjectData
} = require("../../../../../core/utils/ObjectFromVariableUtils");

const PRINT_PREVIEW_URL =
  ConfigUtils.getConfigProp("baseUrl") + "/cloudeditor/preview";
const COMPLETE_PERSONALIZATION_URL =
  ConfigUtils.getConfigProp("baseUrl") + "/cloudeditor/complete";

const getPreviewProject = state => {
  const activePage = state.project.activePage;
  let project = {
    pages: {
      [activePage]: state.project.pages[activePage]
    },
    objects: pick(
      state.project.pages[activePage].objectsIds,
      state.project.objects
    ),
    pagesOrder: { activePage },
    activePage,
    configs: {
      ...state.project.configs.document,
      objects: { ...state.project.configs.objects }
    }
  };
  return project;
};

const getPreview = (state$, obs) => {
  const project = getPreviewProject(state$.value);
  const activePageId = state$.value.project.activePage;
  const page = state$.value.project.pagesOrder.indexOf(activePageId) + 1;
  const serverData = {
    project,
    id: state$.value.productInformation.templateId,
    selection: state$.value.selection,
    storeFolder: state$.value.apiInformation.targetFolder,
    page
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
          imageUrls[page - 1] = data.data.image;
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
          getPreview(state$, obs);
        })
      )
    ),
  onEpicCompletePersonalization: (action$, state$) =>
    action$.pipe(
      ofType(COMPLETE_PERSONALIZATION),
      mergeMap(action$ =>
        Observable.create(obs => {
          const previewProject = getPreviewProject(state$.value);
          const serverData = {
            file: state$.value.selection,
            preview: state$.value.preview.pageUrl,
            template_id: state$.value.productInformation.templateId,
            store_id: state$.value.apiInformation.storeId,
            hook_url: state$.value.apiInformation.hookUrl,
            product_id: state$.value.productInformation.productId,
            storeFolder: state$.value.apiInformation.targetFolder,
            session: state$.value.apiInformation.session,
            basketId: state$.value.apiInformation.basketId,
            designId: state$.value.apiInformation.designId,
            sourceParameters: state$.value.apiInformation.sourceParameters,
            projectEditId: state$.value.apiInformation.projectEditId,
            project_data: {
              content: {
                previewProject,
                saveData: createProjectData(state$.value)
              },
              template_id: state$.value.productInformation.templateId
            }
          };
          axios
            .post(COMPLETE_PERSONALIZATION_URL, qs.stringify(serverData))
            .then(resp => resp.data)
            .then(data => {
              if (data.success) {
                window.location =
                  state$.value.apiInformation.hookUrl + "?jwt=" + data.data;
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
