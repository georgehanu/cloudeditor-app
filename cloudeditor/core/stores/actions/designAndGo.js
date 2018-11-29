const {
  DAG_UPLOAD_IMAGE,
  DAG_CHANGE_SLIDER,
  DAG_CHANGE_ACTIVE_COLOR_SCHEMA,
  DAG_CHANGE_COLOR_PICKER,
  DAG_CHANGE_INPUT,
  DAG_SIGNIN_START,
  DAG_SIGNIN_CLEAR_MESSAGE
} = require("../actionTypes/designAndGo");
const { createActions } = require("redux-actions");

const { dagUploadImage } = createActions(DAG_UPLOAD_IMAGE);
const { dagChangeSlider } = createActions(DAG_CHANGE_SLIDER);
const { dagChangeActiveColorSchema } = createActions(
  DAG_CHANGE_ACTIVE_COLOR_SCHEMA
);
const { dagChangeColorPicker } = createActions(DAG_CHANGE_COLOR_PICKER);
const { dagChangeInput } = createActions(DAG_CHANGE_INPUT);
const { dagSigninStart } = createActions(DAG_SIGNIN_START);
const { dagSigninClearMessage } = createActions(DAG_SIGNIN_CLEAR_MESSAGE);

module.exports = {
  dagUploadImage,
  dagChangeSlider,
  dagChangeActiveColorSchema,
  dagChangeColorPicker,
  dagChangeInput,
  dagSigninStart,
  dagSigninClearMessage
};
