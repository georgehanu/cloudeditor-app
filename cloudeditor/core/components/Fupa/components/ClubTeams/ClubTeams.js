import withSpinner from "../../../../hoc/withSpinner";
const React = require("react");
const { withNamespaces } = require("react-i18next");
const { isEmpty, filter, propEq, map, pipe, pathOr, slice } = require("ramda");
const { classes } = require("./clubTeams.css");

const Error = require("../../UI/Error/Error");
const Back = require("../../UI/Back/Back");

const clubTeams = props => {
  const { t, tReady, club, hide, teams } = props;
  let component = null;
  let renderTeams = null;

  const clubTeamItem = clubTeam => {
    let teamName = null;
    const rawName = pathOr(t("N/A"), ["ageGroup", "name"], clubTeam);
    const ageSlug = pathOr(null, ["ageGroup", "slug"], clubTeam);
    const level = pathOr(1, ["level"], clubTeam);
    if (ageSlug === "m") {
      teamName = level + ". " + t("Mannschaft");
    } else {
      teamName = rawName + (level > 1 ? " (" + level + ".)" : "");
    }

    return (
      <div
        className="dachzeile"
        style={{ cursor: "pointer" }}
        key={clubTeam.id}
        onClick={() => props.selected(clubTeam.id)}
      >
        <span>
          <strong>{teamName}</strong>
        </span>
        <span>
          <span className="liga">
            {pathOr(t("N?A"), ["competition", "name"], clubTeam)}
          </span>
        </span>
      </div>
    );
  };

  if (!tReady) return null;
  if (hide) return null;
  if (props.error) {
    renderTeams = <Error errorMsg={t("clubTeamsFail")} />;
  } else {
    const renderedClubTeams = pipe(
      slice(0, props.limit),
      map(clubTeamItem)
    )(teams);
    renderTeams = <div className="verein_teams">{renderedClubTeams}</div>;
  }

  component = (
    <div className="verein_teams_container">
      <Back msg={t("Back to Clubs")} clicked={props.backToSearch} />
      <div className="ClubName">
        {t("Club")}: <strong>{club.name}</strong>
      </div>
      <div className="ClubTeam">{t("Team")}:</div>
      {renderTeams}
    </div>
  );
  return component;
};

module.exports = withSpinner(withNamespaces("fupa")(clubTeams));
