const { Observable } = require("rxjs");
const { mapTo } = require("rxjs/operators");
const { ofType } = require("redux-observable");
const { ADD_IMAGE_FROM_BUTTON } = require("../actionTypes/addButton");

module.exports = {
  onEpic: (action$, state$) =>
    action$.pipe(
      ofType("ADD_OBJECT_TO_PAGE"),
      mapTo({ type: ADD_IMAGE_FROM_BUTTON, title: state$.value.project.title })
    )
};
