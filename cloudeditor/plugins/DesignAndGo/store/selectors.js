const { pathOr, pathEq, filter } = require("ramda");
const createCachedSelector = require("re-reselect").default;
const {
  createDeepEqualSelector: createSelector
} = require("../../../core/rewrites/reselect/createSelector");

const {
  variablesVariableSelector
} = require("../../../core/stores/selectors/variables");

const dagRealDimensionSelector = state =>
  pathOr({ width: 0, height: 0 }, ["designAndGo", "realDimension"], state);

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

const dagProductsSelector = state =>
  (state && state.designAndGo && state.designAndGo.products) ||
  (state && state.products) ||
  [];

const dagActiveSliderSelector = state =>
  (state && state.designAndGo && state.designAndGo.activeSlider) ||
  (state && state.activeSlider) ||
  0;
/*
const dagShowUploadImageSelector = state =>
  (state &&
    state.designAndGo &&
    state.designAndGo.sliderData[state.designAndGo.activeSlider].upload) ||
  false;
  */

const dagColorsSelector = state =>
  (state &&
    state.designAndGo &&
    state.designAndGo.sliderData[state.designAndGo.activeSlider].colors) ||
  false;

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
    const filteredVar = filter(
      pathEq(["general", "displayFilter"], filterStr),
      variables
    );
    return filteredVar;
  }
)((state, filterStr) => `variableFilter${filterStr}`);

const dagActiveProductSelector = createSelector(
  [dagActiveSliderSelector, dagProductsSelector],
  (active, products) => {
    return products[active];
  }
);

const dagProductColorsSelector = createSelector(
  [dagActiveProductSelector],
  activeProduct => {
    return {
      colors: activeProduct.collorPallets || [],
      colorPicker: activeProduct.hasCustomPallete || false,
      palleteBgColor: activeProduct.palleteBgColor || "rgb(255, 0, 0)",
      activeColorButton: activeProduct.activeColorButton || 0
    };
  }
);

const dagShowUploadImageSelector = createSelector(
  [dagActiveProductSelector],
  activeProduct => {
    return activeProduct.hasUpload || false;
  }
);

module.exports = {
  dagRealDimensionSelector,
  dagLoadingSelector,
  dagErrorMessageSelector,
  dagImagePathSelector,
  dagSliderDataSelector,
  dagProductsSelector,
  dagActiveSliderSelector,
  dagShowUploadImageSelector,
  dagColorsSelector,
  dagDataSelector,
  dagDataItemsSelector,
  dagDataTitleSelector,
  dagDataDescriptionSelector,
  dagLoadingSignInSelector,
  dagErrorMessageSignInSelector,
  getVariablesByFilter,
  dagActiveProductSelector,
  dagProductColorsSelector
};
