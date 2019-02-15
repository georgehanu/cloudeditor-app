const React = require("react");
require("./Matches.css");
const withProduction = require("../../../hoc/withProduction");
const withSpinner = require("../../../../../core/hoc/withSpinner/withSpinner");
const MatchesTable = require("./MatchesTable");
const { withNamespaces } = require("react-i18next");

const Matches = props => {
  return <MatchesTable {...props} />;
};

module.exports = withSpinner(
  withProduction(withNamespaces("fupa")(Matches), "Matches")
);
