const { createSelectorCreator, defaultMemoize } = require("reselect");
const { equals } = require("ramda");
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, equals);
module.exports = { createDeepEqualSelector };
