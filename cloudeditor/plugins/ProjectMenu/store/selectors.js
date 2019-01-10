const { pathOr } = require("ramda");

const authLoggedInSelector = state => {
  return pathOr({}, ["auth", "loggedIn"], state);
};

const authLoadingSelector = state => {
  return pathOr({}, ["auth", "loading"], state);
};

const authErrorMessageSelector = state => {
  return pathOr({}, ["auth", "errorMessage"], state);
};

module.exports = {
  authLoggedInSelector,
  authLoadingSelector,
  authErrorMessageSelector
};
