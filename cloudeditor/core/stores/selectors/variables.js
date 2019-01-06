const { pathOr } = require("ramda");

const createCachedSelector = require("re-reselect").default;

const { getCompleteVariable } = require("../../utils/VariableUtils");

const variablesVariablesSelector = state =>
  pathOr({}, ["variables", "variables"], state);
const variablesConfigsSelector = state =>
  pathOr({}, ["variables", "configs"], state);

const variablesVariableSelector = (state, varName) => {
  console.log("variablesVariableSelector", varName);
  return pathOr({}, ["variables", "variables", varName], state);
};

const getCompleteVariableByName = createCachedSelector(
  variablesVariableSelector,
  variablesConfigsSelector,
  (variable, configs) => {
    console.log("getCompleteVariableByName");
    return getCompleteVariable(variable, configs);
  }
)((state, varName) => varName);

// const variablesVariableSelector = variableName => {
//   return createSelector(
//     variableName,
//     name => {
//       return pathOr({}, ["variables", "variables", name], state);
//     }
//   );
// };

//const completeVariablesSelector = createCachedSelector(variablesVariableSelector, variablesConfigsSelector, ())
// const completeVariablesSelector = createSelector(
//   variablesVariablesSelector,
//   variablesConfigsSelector,
//   (variables, configs) => {
//     return getCompleteVariables(variables, configs);
//   }
// );

module.exports = {
  variablesVariablesSelector,
  variablesConfigsSelector,
  variablesVariableSelector,
  getCompleteVariableByName
};
