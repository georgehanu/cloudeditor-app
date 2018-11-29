const { map } = require("rxjs/operators");
const { ofType } = require("redux-observable");

const { addImageFromButton } = require("../actions/addButton");
const { ADD_OBJECT_TO_PAGE } = require("../actionTypes/project");

module.exports = {
  addImageFromButtonEpic: action$ =>
    action$.pipe(
      ofType(ADD_OBJECT_TO_PAGE),
      map(addImageFromButton)
    )
};
