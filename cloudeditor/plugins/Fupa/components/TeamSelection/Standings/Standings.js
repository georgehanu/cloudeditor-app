const React = require("react");
const { withNamespaces } = require("react-i18next");
require("./Standings.css");
const withProduction = require("../../../hoc/withProduction");
const withSpinner = require("../../../../../core/hoc/withSpinner/withSpinner");
const Colors = require("../Utils/Colors");

const fupaTdBase = {
  padding: "4px 0px",
  margin: "0",
  borderBottom: "none",
  textAlign: "center",
  fontSize: "12px",
  lineHeight: "12px",
  border: "none",
  fontFamily: "Arial"
};

const fupaImageWrapper = {
  position: "relative",
  display: "inline-block",
  verticalAlign: "middle",
  textAlign: "center",
  overflow: "hidden"
};

const fupaImageWrapperPicture = {
  objectFit: "contain",
  height: "inherit",
  width: "inherit"
};

const Standings = props => {
  const header = (
    <tr>
      <td style={{ ...fupaTdBase, ...Colors.oddRow }}>
        {props.t("Standings_Index")}
      </td>
      <td style={{ ...fupaTdBase, ...Colors.oddRow }}>
        {props.t("Standings_UpDown")}
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
          width="24px"
          style={{
            ...fupaTd,
            fontWeight: "bold",
            ...mark
          }}
        >
          {el.rank}.
        </td>
        <td width="14px" style={{ ...fupaTd, textAlign: "left" }} title="">
          <div style={{ color: "#bfbfbf" }} />
        </td>
        <td width="30px" style={{ ...fupaTd, padding: "1px 2px" }}>
          <div style={{ ...fupaImageWrapper, width: "25px", height: "25px" }}>
            <picture style={{ ...fupaImageWrapperPicture }}>
              <source srcSet={imageUrl + " 1x, " + imageUrl + " 2x"} />
              <img
                src={imageUrl}
                title={el.team.name.full}
                alt={el.team.name.full}
                style={{ ...fupaImageWrapperPicture }}
              />
            </picture>
          </div>
        </td>

        <td
          width="162px"
          style={{ ...fupaTd, textAlign: "left", paddingLeft: "4px" }}
        >
          {el.team.name.full}
        </td>

        <td width="18px" style={{ ...fupaTd }}>
          {el.matches}
        </td>

        <td width="18px" style={{ ...fupaTd }}>
          {el.wins}
        </td>
        <td width="18px" style={{ ...fupaTd }}>
          {el.draws}
        </td>
        <td width="18px" style={{ ...fupaTd }}>
          {el.defeats}
        </td>
        <td width="40px" style={{ ...fupaTd }}>
          {el.ownGoals + ":" + el.againstGoals}
        </td>

        <td width="18px" style={{ ...fupaTd }}>
          {el.goalDifference}
        </td>

        <td width="20px" style={{ ...fupaTd }}>
          <strong>{el.points}</strong>
        </td>
      </tr>
    );
  });

  return (
    <React.Fragment>
      {header}
      {teams}
    </React.Fragment>
  );
};

module.exports = withSpinner(
  withProduction(withNamespaces("fupa")(Standings), "Standings")
);
