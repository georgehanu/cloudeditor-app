const React = require("react");
const StandingsTable = require("../Standings/StandingsTable");
const MatchesTable = require("../Matches/MatchesTable");
const PlayersTable = require("../Players/PlayersTable");

const ShowTable = props => {
  if (props.tableData === null) return null;

  if (props.tableName === "Standings") {
    return (
      <StandingsTable
        {...props}
        standings={props.tableData}
        teamId={props.fupaData.queryData.teamId}
      />
    );
  } else if (props.tableName === "Matches") {
    return (
      <MatchesTable
        {...props}
        matches={props.tableData}
        teamId={props.fupaData.queryData.teamId}
      />
    );
  } else if (props.tableName === "Players") {
    return <PlayersTable {...props} players={props.tableData} />;
  } else {
    return null;
  }
};

module.exports = ShowTable;
