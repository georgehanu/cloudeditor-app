const React = require("react");
require("./Matches.css");
const withProduction = require("../../../hoc/withProduction");
const withSpinner = require("../../../../../core/hoc/withSpinner/withSpinner");
const MatchesTable = require("./MatchesTable");

const Matches = props => {
  return <MatchesTable {...props} />;
};

module.exports = withSpinner(withProduction(Matches, "Matches"));
