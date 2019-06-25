const { Observable } = require("rxjs");
const { mapTo, mergeMap } = require("rxjs/operators");
const { ofType } = require("redux-observable");
const {
  map,
  forEach,
  indexOf,
  pick,
  forEachObjIndexed,
  pathOr
} = require("ramda");
const axios = require("../../axios/project/axios");
const {
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
  PROJ_SHOW_POPUP
} = require("../actionTypes/project");

const {
  PROJ_LOAD_VARIABLES_SUCCESS,
  UPDATE_OBJ_FROM_VARIABLE_INIT,
  UPDATE_OBJ_COLOR_FROM_VARIABLE,
  UPDATE_OBJ_IMAGE_FROM_VARIABLE
} = require("../actionTypes/variables");
const {
  PROJ_LOAD_DAG_SUCCESS,
  DAG_CHANGE_RENDER_ID
} = require("../../../plugins/DesignAndGo/store/actionTypes/designAndGo");

const SAVE_PROJ = "projects/store";
const LOAD_PROJ = "projects/list";
const DELETE_PROJ = "projects/destroy";
const LOAD_ONE_PROJ = "/projects/cloudeditoredit";

const createProjectData = state => {
  let project = {};
  //read variables
  const activeSlider = state.designAndGo.activeSlider;

  const variables = map(variable => {
    switch (variable.type) {
      case "color":
      case "text":
        return {
          name: variable.name,
          value: variable.value
        };
      case "image":
        //read cropping params from page
        const activePageId =
          state.project.pagesOrder[
            state.designAndGo.products[activeSlider].pageNo
          ];
        const activePageObjectsIds =
          state.project.pages[activePageId].objectsIds;

        let imageObjectId = null;
        forEach(bId => {
          if (indexOf(bId, activePageObjectsIds) >= 0) imageObjectId = bId;
        }, variable.registered);

        let cropX = null;
        let cropY = null;
        let cropW = null;
        let cropH = null;

        if (imageObjectId) {
          const objectData = state.project.objects[imageObjectId];
          cropX = objectData.cropX;
          cropY = objectData.cropY;
          cropW = objectData.cropW;
          cropH = objectData.cropH;
        }

        return {
          name: variable.name,
          image_path: variable.image_path,
          image_src: variable.image_src,
          ratioWidth: variable.ratioWidth,
          ratioHeight: variable.ratioHeight,
          imageWidth: variable.imageWidth,
          imageHeight: variable.imageHeight,
          cropX,
          cropY,
          cropW,
          cropH
        };
    }
  }, state.variables.variables);

  project["variables"] = variables;
  project["activeSlider"] = activeSlider;
  project["activeColorButton"] =
    state.designAndGo.products[activeSlider].activeColorButton;
  project["palleteBgColor"] =
    state.designAndGo.products[activeSlider].palleteBgColor || null;
  return project;
};

module.exports = {
  onEpicSave: (action$, state$) =>
    action$.pipe(
      ofType(PROJ_SAVE_START),
      mergeMap(action$ =>
        Observable.create(obs => {
          let serverData = new FormData();
          serverData.append("session", state$.value.apiInformation.session);
          serverData.append("store_id", state$.value.apiInformation.storeId);
          serverData.append(
            "template_id",
            state$.value.productInformation.templateId
          );
          serverData.append("project_id", state$.value.project.projectId || 0);
          serverData.append("project_name", action$.payload.name);
          serverData.append("project_description", action$.payload.description);
          serverData.append("overwrite", action$.payload.overwrite);
          const project_data = createProjectData(state$.value);
          serverData.append("project_data", JSON.stringify(project_data));
          axios
            .post(SAVE_PROJ, serverData)
            .then(resp => resp.data)
            .then(data => {
              if (data.success) {
                obs.next({
                  type: PROJ_SAVE_SUCCESS,
                  name: action$.payload.name,
                  description: action$.payload.description,
                  projectId: data.projId,
                  message: data.message
                });
              } else {
                if (data.confirmBox) {
                  obs.next({
                    type: PROJ_SHOW_POPUP,
                    payload: "Error message: " + data.confirmBoxText
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
          serverData.append("session", state$.value.apiInformation.session);
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
                  data: data.data
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
          serverData.append("id", action$.payload.projectId);
          serverData.append("session", state$.value.apiInformation.session);
          serverData.append(
            "template_id",
            state$.value.productInformation.templateId
          );

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
          serverData.append("project_id", action$.payload.projectId);
          serverData.append("session", state$.value.apiInformation.session);
          serverData.append(
            "template_id",
            state$.value.productInformation.templateId
          );

          axios
            .post(LOAD_ONE_PROJ, serverData)
            .then(resp => resp.data)
            .then(data => {
              if (data.success) {
                const state = state$.value;
                const activeSlider = data.data.project_data.activeSlider;
                const userImageVar = pathOr(
                  null,
                  ["userImage"],
                  pick(["userImage"], data.data.project_data.variables)
                );

                let newObjects = {};

                if (userImageVar) {
                  const activePageId =
                    state.project.pagesOrder[
                      state.designAndGo.products[activeSlider].pageNo
                    ];
                  const activePageObjectsIds =
                    state.project.pages[activePageId].objectsIds;

                  const activePageObjects = pick(
                    activePageObjectsIds,
                    state.project.objects
                  );

                  forEachObjIndexed((block, blockId) => {
                    if (
                      block.hasOwnProperty("dynamicImage") &&
                      block.dynamicImage === "userImage"
                    ) {
                      newObjects[blockId] = {
                        ...block,
                        cropX: userImageVar.cropX,
                        cropY: userImageVar.cropY,
                        cropW: userImageVar.cropW,
                        cropH: userImageVar.cropH
                      };
                    }
                  }, activePageObjects);
                }

                obs.next({
                  type: PROJ_LOAD_DAG_SUCCESS,
                  data: data.data.project_data
                });
                obs.next({
                  type: PROJ_LOAD_VARIABLES_SUCCESS,
                  data: data.data.project_data
                });
                obs.next({
                  type: PROJ_LOAD_PROJECT_SUCCESS,
                  data: { ...data.data, objects: newObjects },
                  projectId: action$.payload.projectId
                });
                obs.next({
                  type: UPDATE_OBJ_FROM_VARIABLE_INIT,
                  payload: {
                    objects: state$.value.project.objects,
                    variables: state$.value.variables.variables
                  }
                });
                obs.next({
                  type: UPDATE_OBJ_COLOR_FROM_VARIABLE,
                  payload: {
                    variables: pick(
                      ["color1", "color2", "color3"],
                      state$.value.variables.variables
                    )
                  }
                });
                obs.next({
                  type: UPDATE_OBJ_IMAGE_FROM_VARIABLE,
                  payload: {
                    variables: pick(
                      ["userImage"],
                      state$.value.variables.variables
                    )
                  }
                });
                obs.next(() => {
                  window.dgSlider.slickGoTo(
                    data.data.project_data.activeSlider
                  );
                });
                /*  obs.next({
                  type: DAG_CHANGE_RENDER_ID
                }); */
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
    )
};
