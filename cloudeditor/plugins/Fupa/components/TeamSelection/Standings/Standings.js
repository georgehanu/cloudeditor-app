const React = require("react");
require("./Standings.css");
const withProduction = require("../../../hoc/withProduction");
const withSpinner = require("../../../../../core/hoc/withSpinner/withSpinner");
const StandingsTable = require("./StandingsTable");
const { withNamespaces } = require("react-i18next");

const Standings = props => {
  return <StandingsTable {...props} />;
};

module.exports = withSpinner(
  withProduction(withNamespaces("fupa")(Standings), "Standings")
);
