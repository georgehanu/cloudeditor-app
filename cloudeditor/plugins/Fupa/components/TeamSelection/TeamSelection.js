const Standings = require("./Standings/Standings");
const Matches = require("./Matches/Matches");
const Players = require("./Players/Players");

const React = require("react");
const { withNamespaces } = require("react-i18next");
const { map, pipe, pathOr, slice } = require("ramda");

const teamSelection = props => {
  const { t, tReady, club, teams, team, hide } = props;
  let component = null;

  if (!tReady) return null;
  if (hide) return null;

  const teamItem = item => {
    let teamName = null;
    const rawName = pathOr(t("N/A"), ["ageGroup", "name"], item);
    const ageSlug = pathOr(null, ["ageGroup", "slug"], item);
    const level = pathOr(1, ["level"], item);
    if (ageSlug === "m") {
      teamName = level + ". " + t("Mannschaft");
    } else {
      teamName = rawName + (level > 1 ? " (" + level + ".)" : "");
    }

    return (
      <option key={item.id} value={item.id}>
        {teamName}
      </option>
    );
  };

  const teamsList = pipe(
    slice(0, props.limit),
    map(teamItem)
  )(teams);

  component = (
    <div className="verein_teams_container">
      <div className="ClubName">
        {t("Club")}: <strong>{club.name}</strong>
      </div>
      <div className="ClubTeam">
        {t("Team")}:
        <select
          onChange={event => props.changed(Number(event.target.value))}
          value={team.id}
        >
          {teamsList}
        </select>
        <Standings
          {...props.teamStandings}
          {...props.tableSizes["Standings"]}
        />
        <Matches {...props.teamMatches} {...props.tableSizes["Matches"]} />
        <Players {...props.teamPlayers} {...props.tableSizes["Players"]} />
      </div>
    </div>
  );
  return component;
};

module.exports = withNamespaces("fupa")(teamSelection);
