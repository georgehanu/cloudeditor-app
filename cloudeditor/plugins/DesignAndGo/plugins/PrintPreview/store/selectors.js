const { pathOr } = require("ramda");

const previewEnabeldSelector = state =>
  pathOr(false, ["preview", "enabled"], state);

const previewLoadingSelector = state =>
  pathOr(false, ["preview", "loading"], state);

const previewPageUrlSelector = state =>
  pathOr(null, ["preview", "pageUrl"], state);

const previewErrorMessageSelector = state =>
  pathOr(null, ["preview", "errorMessage"], state);

module.exports = {
  previewEnabeldSelector,
  previewLoadingSelector,
  previewPageUrlSelector,
  previewErrorMessageSelector
};
