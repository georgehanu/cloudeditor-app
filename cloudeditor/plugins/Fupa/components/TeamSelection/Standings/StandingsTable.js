const React = require("react");
require("./Standings.css");
const Colors = require("../Utils/Colors");
const TableStyles = require("../Utils/TableStyles");
const { mergeDeepRight } = require("ramda");
const { withNamespaces } = require("react-i18next");

const StandingsTable = ({ tableStyle = "default", ...props }) => {
  let thisStyle = TableStyles.Standings.default;
  if (tableStyle !== "default") {
    thisStyle = mergeDeepRight(
      TableStyles.Standings.default,
      TableStyles.Standings[tableStyle]
    );
  }

  const tblStyle = thisStyle.tableStyle;
  const tbodyStyle = thisStyle.tbodyStyle;
  const fupaImageWrapperPicture = thisStyle.fupaImageWrapperPicture;
  const fupaTdBase = thisStyle.fupaTdBase;

  const header = (
    <tr>
      <td style={{ ...fupaTdBase, ...Colors.oddRow }}>
        {props.t("Standings_Index")}
      </td>
      <td style={{ ...fupaTdBase, ...Colors.oddRow }}>
        {props.t("Standings_Logo")}
      </td>
      <td style={{ ...fupaTdBase, ...Colors.oddRow }}>
        {props.t("Standings_Team")}
      </td>
      <td style={{ ...fupaTdBase, ...Colors.oddRow }}>
        {props.t("Standings_Played")}
      </td>
      <td style={{ ...fupaTdBase, ...Colors.oddRow }}>
        {props.t("Standings_Wins")}
      </td>
      <td style={{ ...fupaTdBase, ...Colors.oddRow }}>
        {props.t("Standings_Draws")}
      </td>
      <td style={{ ...fupaTdBase, ...Colors.oddRow }}>
        {props.t("Standings_Loses")}
      </td>
      <td style={{ ...fupaTdBase, ...Colors.oddRow }}>
        {props.t("Standings_Goals")}
      </td>
      <td style={{ ...fupaTdBase, ...Colors.oddRow }}>
        {props.t("Standings_Goals_Diff")}
      </td>
      <td style={{ ...fupaTdBase, ...Colors.oddRow }}>
        {props.t("Standings_Points")}
      </td>
    </tr>
  );

  const teams = props.standings.map((el, index) => {
    const imageUrl = el.team.image.svg
      ? el.team.image.basePath + "svg/" + el.team.image.baseName
      : //: el.team.image.basePath + "png/200x200/" + el.team.image.baseName;
        el.team.image.basePath + "png/25x25/" + el.team.image.baseName;

    let selectedRow = props.teamId === el.team.id ? { ...Colors.ownTeam } : {};
    let tdBackground =
      index % 2 === 0 ? { ...Colors.evenRow } : { ...Colors.oddRow };

    let mark = {};
    if (el.mark === "up1") {
      mark = { ...Colors.up1 };
    } else if (el.mark === "up2") {
      mark = { ...Colors.up2 };
    } else if (el.mark === "up3") {
      mark = { ...Colors.up3 };
    } else if (el.mark === "down1") {
      mark = { ...Colors.down1 };
    } else if (el.mark === "down2") {
      mark = { ...Colors.down2 };
    }

    let fupaTd = { ...tdBackground, ...fupaTdBase, ...selectedRow };

    return (
      <tr key={index}>
        <td
          style={{
            ...fupaTd,
            ...thisStyle.cols[1],
            ...mark
          }}
        >
          {el.rank}.
        </td>

        <td style={{ ...fupaTd, ...thisStyle.cols[2] }}>
          <img
            src={imageUrl}
            title={el.team.name.full}
            alt={el.team.name.full}
            style={{ ...fupaImageWrapperPicture }}
          />
        </td>

        <td style={{ ...fupaTd, ...thisStyle.cols[3] }}>{el.team.name.full}</td>
        <td style={{ ...fupaTd, ...thisStyle.cols[4] }}>{el.matches}</td>
        <td style={{ ...fupaTd, ...thisStyle.cols[5] }}>{el.wins}</td>
        <td style={{ ...fupaTd, ...thisStyle.cols[6] }}>{el.draws}</td>
        <td style={{ ...fupaTd, ...thisStyle.cols[7] }}>{el.defeats}</td>
        <td style={{ ...fupaTd, ...thisStyle.cols[8] }}>
          {el.ownGoals + ":" + el.againstGoals}
        </td>
        <td style={{ ...fupaTd, ...thisStyle.cols[9] }}>{el.goalDifference}</td>
        <td style={{ ...fupaTd, ...thisStyle.cols[10] }}>
          <strong>{el.points}</strong>
        </td>
      </tr>
    );
  });

  return (
    <React.Fragment>
      <table style={{ ...tblStyle }}>
        <tbody style={{ ...tbodyStyle }}>
          {header}
          {teams}
        </tbody>
      </table>
    </React.Fragment>
  );
};

module.exports = withNamespaces("fupa")(StandingsTable);
