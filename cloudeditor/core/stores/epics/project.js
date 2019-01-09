const { mapTo } = require("rxjs/operators");
const { ofType } = require("redux-observable");
const { rerenderPage } = require("../../../core/utils/UtilUtils");
const { ADD_IMAGE_FROM_BUTTON } = require("../actionTypes/addButton");
const { CHANGE_PAGE } = require("../actionTypes/project");
const dispachEvent = () => {
  setTimeout(() => {
    // rerenderPage();
  }, 0);
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
    )
};
