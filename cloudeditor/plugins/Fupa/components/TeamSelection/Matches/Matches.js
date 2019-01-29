const React = require("react");
require("./Matches.css");
const withProduction = require("../../../hoc/withProduction");
const withSpinner = require("../../../../../core/hoc/withSpinner/withSpinner");
const Colors = require("../Utils/Colors");

const scoreCard = {
  color: "#212121",
  fontSize: "14px",
  position: "relative",
  textAlign: "center",
  width: "60px",
  fontWeight: "normal !important",
  backgroundColor: "#3bba27",
  height: "24px"
};

const matchesWeekDay = [
  "Match_Monday",
  "Match_Tuesday",
  "Match_Wednesday",
  "Match_Thursday",
  "Match_Friday",
  "Match_Saturday",
  "Match_Sunday"
];

const fupaTdBase = {
  padding: "5px",
  paddingRight: "2px",
  margin: "0",
  borderBottom: "1px solid #fff",
  textAlign: "center",
  border: "none"
};

const fupaImageWrapperPicture = {
  objectFit: "contain",
  height: "25px",
  width: "25px",
  marginLeft: "3px"
};

const Matches = props => {
  const matches = props.matches.map((el, index) => {
    let oponentTeam = null;
    let location = null;
    let matchDay =
      el.matchDayNumber === 0 ? props.t("NA") : el.matchDayNumber + ".";
    let currentTeamGoals = 0;
    let opositeTeamGoals = 0;
    if (el.guestTeam.id === props.teamId) {
      oponentTeam = el.homeTeam;
      location = props.t("AwayLetter");
      currentTeamGoals = el.guestGoal;
      opositeTeamGoals = el.homeGoal;
    } else {
      oponentTeam = el.guestTeam;
      location = props.t("HomeLetter");
      currentTeamGoals = el.homeGoal;
      opositeTeamGoals = el.guestGoal;
    }

    const imageUrl =
      oponentTeam.image.basePath +
      (oponentTeam.image.svg
        ? "svg/" + oponentTeam.image.baseName
        : "png/25x25/" + oponentTeam.image.baseName);

    let matchInfo = null;
    let matchInfoBgColor = null;
    let matchInfoFgColor = "white";
    const kickoffDate = new Date(el.kickoff);
    const kickoffDay =
      kickoffDate.getDate() > 9
        ? kickoffDate.getDate()
        : "0" + kickoffDate.getDate();
    const kickoffMonth =
      kickoffDate.getMonth() > 8
        ? kickoffDate.getMonth() + 1
        : "0" + (kickoffDate.getMonth() + 1);
    const kickoffDateStr = kickoffDay + "." + kickoffMonth;
    const weekDate = props.t(matchesWeekDay[kickoffDate.getDay()]);

    if (el.section === "PRE") {
      // match did not happen yet, we have to display the date
      matchInfoBgColor = "#ececec";
      matchInfo = (
        <div style={{ lineHeight: "24px" }}>
          <span style={{ color: "#000", fontSize: "11px" }}>
            {kickoffDateStr}
          </span>
        </div>
      );
    } else {
      // display the score
      if (currentTeamGoals === opositeTeamGoals) {
        matchInfoBgColor = "#a0a0a0";
      } else if (currentTeamGoals > opositeTeamGoals) {
        matchInfoBgColor = "#3bba27";
      } else {
        matchInfoBgColor = "#e50a19";
      }
      matchInfo = (
        <div style={{ lineHeight: "24px" }}>
          <span>{el.homeGoal}</span>
          <span>:</span>
          <span>{el.guestGoal}</span>
        </div>
      );
    }

    let tdBackground =
      index % 2 === 0 ? { ...Colors.evenRow } : { ...Colors.oddRow };
    let fupaTd = { ...tdBackground, ...fupaTdBase };

    return (
      <tr key={index}>
        <td
          width="20"
          style={{ ...fupaTd, paddingLeft: "2px", fontWeight: "bold" }}
        >
          {matchDay}
        </td>
        <td style={{ ...fupaTd }}>
          {weekDate}, {kickoffDateStr}
        </td>
        <td style={{ ...fupaTd, fontWeight: "bold" }}>{location}</td>
        <td width="30px" style={{ ...fupaTd, padding: "1px 2px" }}>
          <img
            src={imageUrl}
            title={oponentTeam.name.full}
            alt={oponentTeam.name.full}
            style={{ ...fupaImageWrapperPicture }}
          />
        </td>
        <td align="left" style={{ ...fupaTd }}>
          {oponentTeam.name.full}
        </td>
        <td style={{ ...fupaTd }}>&nbsp;</td>
        <td style={{ ...fupaTd, paddingRight: "0px" }}>
          <div
            style={{
              ...scoreCard,
              backgroundColor: matchInfoBgColor,
              float: "right"
            }}
          >
            <div style={{ display: "inline-block", color: matchInfoFgColor }}>
              {matchInfo}
            </div>
          </div>
        </td>
      </tr>
    );
  });

  return <React.Fragment>{matches}</React.Fragment>;
};

module.exports = withSpinner(withProduction(Matches, "Matches"));
