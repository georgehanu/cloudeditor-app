const React = require("react");
const withProduction = require("../../../hoc/withProduction");
const withSpinner = require("../../../../../core/hoc/withSpinner/withSpinner");
const PlayersTable = require("./PlayersTable");
const { withNamespaces } = require("react-i18next");

const Players = props => {
  return <PlayersTable {...props} />;
};

module.exports = withSpinner(
  withProduction(withNamespaces("fupa")(Players), "Players")
);
