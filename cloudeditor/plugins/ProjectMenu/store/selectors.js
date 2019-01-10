const { pathOr } = require("ramda");

const authLoggedInSelector = state => {
  return pathOr(false, ["auth", "loggedIn"], state);
};

const authLoadingSelector = state => {
  return pathOr(false, ["auth", "loading"], state);
};

const authErrorMessageSelector = state => {
  return pathOr(null, ["auth", "errorMessage"], state);
};

module.exports = {
  authLoggedInSelector,
  authLoadingSelector,
  authErrorMessageSelector
};
