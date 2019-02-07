const React = require("react");
require("./Standings.css");
const withProduction = require("../../../hoc/withProduction");
const withSpinner = require("../../../../../core/hoc/withSpinner/withSpinner");
const StandingsTable = require("./StandingsTable");

const Standings = props => {
  return <StandingsTable {...props} />;
};

module.exports = withSpinner(withProduction(Standings, "Standings"));
