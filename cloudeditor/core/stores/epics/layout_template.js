const { ofType } = require("redux-observable");
const { mergeMap } = require("rxjs/operators");
const axios = require("axios");
const { Observable } = require("rxjs");
const { forEach } = require("ramda");
const {
  SAVE_LAYOUT_TEMPLATE_START,
  SAVE_LAYOUT_TEMPLATE_FAILED,
  SAVE_LAYOUT_TEMPLATE_SUCCESS,
  SAVE_ICON_TEMPLATE_START,
  SAVE_ICON_TEMPLATE_FAILED,
  SAVE_ICON_TEMPLATE_SUCCESS
} = require("../actionTypes/layout_template");
const recursiveParseBlocks = (objectsIds, objects, returnData) => {
  forEach(function(id) {
    if (objects[id].hasOwnProperty("objectsIds"))
      recursiveParseBlocks(objects[id]["objectsIds"], objects, returnData);
    returnData[id] = objects[id];
  }, objectsIds);
  return returnData;
};

const STORE_ICON_URL = uploadProjectIconUrl;

module.exports = {
  onEpicSaveLayout: (action$, state$) =>
    action$.pipe(
      ofType(SAVE_LAYOUT_TEMPLATE_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let formData = new FormData();
          for (var key in action$.payload) {
            formData.append(key, action$.payload[key]);
          }
          formData.append("form_key", formKey);

          if (state$.value.project.configs.document.headerEditor) {
            const header = { ...state$.value.project.configs.document.header };
            const returnData = {};
            const blocks = recursiveParseBlocks(
              header.objectsIds,

              state$.value.project.objects,
              returnData
            );
            const savedData = {
              header: {
                objectsIds: header.objectsIds,
                height: header.height
              },
              blocks
            };
            formData.append("type", "header");
            formData.append("hfData", JSON.stringify(savedData));
          } else {
            if (state$.value.project.configs.document.footerEditor) {
              const footer = {
                ...state$.value.project.configs.document.footer
              };
              const returnData = {};
              const blocks = recursiveParseBlocks(
                footer.objectsIds,
                state$.value.project.objects,
                returnData
              );
              const savedData = {
                footer: {
                  height: footer.height,
                  objectsIds: footer.objectsIds
                },
                blocks
              };
              formData.append("type", "footer");
              formData.append("hfData", JSON.stringify(savedData));
            } else {
              formData.append("type", "page");
            }
          }
          axios
            .post(saveProjectURL, formData)
            .then(resp => resp.data)
            .then(data => {
              //console.log(data, "d");
              if (data.success) {
                obs.next({
                  type: SAVE_LAYOUT_TEMPLATE_SUCCESS
                });
              } else {
                obs.next({
                  type: SAVE_LAYOUT_TEMPLATE_FAILED,
                  payload: "Error saving template"
                });
              }
              obs.complete();
            })
            .catch(error => {
              obs.next({
                type: SAVE_LAYOUT_TEMPLATE_FAILED,
                payload: "Error message: " + error.message
              });
              obs.complete();
            });
        })
      )
    ),
  onEpicSaveIconLayout: (action$, state$) =>
    action$.pipe(
      ofType(SAVE_ICON_TEMPLATE_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let formData = new FormData();
          for (var key in action$.payload) {
            formData.append(key, action$.payload[key]);
          }
          formData.append("form_key", formKey);
          axios
            .post(STORE_ICON_URL, formData)
            .then(resp => resp.data)
            .then(data => {
              if (data.success) {
                obs.next({
                  type: SAVE_ICON_TEMPLATE_SUCCESS,
                  projectIcon: data.fileName,
                  projectIconSrc: data.fileSrc
                });
              } else {
                obs.next({
                  type: SAVE_ICON_TEMPLATE_FAILED,
                  payload: "Error uploading icon template"
                });
              }
              obs.complete();
            })
            .catch(error => {
              obs.next({
                type: SAVE_ICON_TEMPLATE_FAILED,
                payload: "Error message: " + error.message
              });
              obs.complete();
            });
        })
      )
    )
};
