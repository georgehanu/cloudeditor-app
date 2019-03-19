const React = require("react");
require("./Matches.css");
const Colors = require("../Utils/Colors");
const TableStyles = require("../Utils/TableStyles");
const { mergeDeepRight } = require("ramda");

const matchesWeekDay = [
  "Match_Monday",
  "Match_Tuesday",
  "Match_Wednesday",
  "Match_Thursday",
  "Match_Friday",
  "Match_Saturday",
  "Match_Sunday"
];

const MatchesTable = ({ tableStyle = "default", ...props }) => {
  let thisStyle = TableStyles.Matches.default;
  if (tableStyle !== "default") {
    thisStyle = mergeDeepRight(
      TableStyles.Matches.default,
      TableStyles.Matches[tableStyle]
    );
  }
  const tblStyle = thisStyle.tableStyle;
  const tbodyStyle = thisStyle.tbodyStyle;
  const fupaImageWrapperPicture = thisStyle.fupaImageWrapperPicture;
  const fupaTdBase = thisStyle.fupaTdBase;
  const scoreCard = thisStyle.scoreCard;

  const matches = props.matches.map((el, index) => {
    let oponentTeam = null;
    let location = null;
    let matchDay = index + 1 + ".";
    let currentTeamGoals = 0;
    let opositeTeamGoals = 0;
    if (el.awayTeam.id === props.teamId) {
      oponentTeam = el.homeTeam;
      location = props.t("AwayLetter");
      currentTeamGoals = el.awayGoal;
      opositeTeamGoals = el.homeGoal;
    } else {
      oponentTeam = el.awayTeam;
      location = props.t("HomeLetter");
      currentTeamGoals = el.homeGoal;
      opositeTeamGoals = el.awayGoal;
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
      matchInfoFgColor = "#000";
      matchInfo = <React.Fragment>{kickoffDateStr}</React.Fragment>;
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
        <React.Fragment>
          {el.homeGoal}:{el.awayGoal}
        </React.Fragment>
      );
    }

    let tdBackground =
      index % 2 === 0 ? { ...Colors.evenRow } : { ...Colors.oddRow };
    let fupaTd = { ...tdBackground, ...fupaTdBase };

    return (
      <tr key={index}>
        <td style={{ ...fupaTd, ...thisStyle.cols[1] }}>{matchDay}</td>
        <td style={{ ...fupaTd }}>
          {weekDate}, {kickoffDateStr}
        </td>
        <td style={{ ...fupaTd, ...thisStyle.cols[3] }}>{location}</td>
        <td style={{ ...fupaTd, ...thisStyle.cols[4] }}>
          <div
            style={{
              ...fupaImageWrapperPicture,
              backgroundImage: "url(" + imageUrl + ")"
            }}
          />
        </td>
        <td style={{ ...fupaTd, ...thisStyle.cols[5] }}>
          {oponentTeam.name.full}
        </td>
        <td style={{ ...fupaTd, ...thisStyle.cols[6] }}>&nbsp;</td>
        <td
          style={{
            ...fupaTd,
            ...thisStyle.cols[7],
            ...scoreCard,
            backgroundColor: matchInfoBgColor,
            //float: "right",
            color: matchInfoFgColor
          }}
        >
          {matchInfo}
        </td>
      </tr>
    );
  });

  return (
    <React.Fragment>
      <table style={{ ...tblStyle }}>
        <tbody style={{ ...tbodyStyle }}>{matches}</tbody>
      </table>
    </React.Fragment>
  );
};

module.exports = MatchesTable;
