const { pathOr, pathEq, filter } = require("ramda");
const createCachedSelector = require("re-reselect").default;

const {
  variablesVariableSelector
} = require("../../../core/stores/selectors/variables");

const dagLoadingSelector = state =>
  (state && state.designAndGo && state.designAndGo.loading) || false;

const dagErrorMessageSelector = state =>
  (state && state.designAndGo && state.designAndGo.errorMessage) || null;

const dagLoadingSignInSelector = state =>
  (state && state.designAndGo && state.designAndGo.loadingSignIn) || false;

const dagErrorMessageSignInSelector = state =>
  (state && state.designAndGo && state.designAndGo.errorMessageSignIn) || null;

const dagImagePathSelector = state =>
  (state && state.designAndGo && state.designAndGo.imagePath) || null;

const dagSliderDataSelector = state =>
  (state && state.designAndGo && state.designAndGo.sliderData) || [];

const dagActiveSliderSelector = state =>
  (state && state.designAndGo && state.designAndGo.activeSlider) || 0;

const dagShowUploadImageSelector = state =>
  (state &&
    state.designAndGo &&
    state.designAndGo.sliderData[state.designAndGo.activeSlider].upload) ||
  false;

const dagColorsSelector = state =>
  (state &&
    state.designAndGo &&
    state.designAndGo.sliderData[state.designAndGo.activeSlider].colors) ||
  false;

const dagActiveColorButtonSelector = state =>
  (state &&
    state.designAndGo &&
    state.designAndGo.sliderData[state.designAndGo.activeSlider]
      .activeColorButton) ||
  0;

const dagDataSelector = state =>
  (state && state.designAndGo && state.designAndGo.data) || [];

const dagDataItemsSelector = state =>
  (state &&
    state.designAndGo &&
    state.designAndGo.data &&
    state.designAndGo.data.items) ||
  [];

const dagDataTitleSelector = state =>
  (state &&
    state.designAndGo &&
    state.designAndGo.data &&
    state.designAndGo.data.title) ||
  [];

const dagDataDescriptionSelector = state =>
  (state &&
    state.designAndGo &&
    state.designAndGo.data &&
    state.designAndGo.data.description) ||
  [];

const getVariablesByFilter = createCachedSelector(
  state => pathOr({}, ["variables", "variables"], state),
  (state, filterStr) => filterStr,
  (variables, filterStr) => {
    console.log("getVariablesByFilter", filterStr);
    const filteredVar = filter(
      pathEq(["general", "displayFilter"], filterStr),
      variables
    );
    return filteredVar;
  }
)((state, filterStr) => `variableFilter${filterStr}`);

module.exports = {
  dagLoadingSelector,
  dagErrorMessageSelector,
  dagImagePathSelector,
  dagSliderDataSelector,
  dagActiveSliderSelector,
  dagShowUploadImageSelector,
  dagColorsSelector,
  dagActiveColorButtonSelector,
  dagDataSelector,
  dagDataItemsSelector,
  dagDataTitleSelector,
  dagDataDescriptionSelector,
  dagLoadingSignInSelector,
  dagErrorMessageSignInSelector,
  getVariablesByFilter
};
