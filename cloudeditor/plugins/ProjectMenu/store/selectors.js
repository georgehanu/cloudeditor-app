const logenInSelector = state => {
  return pathOr({}, ["auth", "loggedIn"], state);
};

module.exports = {
  logenInSelector
};
