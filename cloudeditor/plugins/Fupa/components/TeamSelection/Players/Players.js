const React = require("react");
const { withNamespaces } = require("react-i18next");
const withProduction = require("../../../hoc/withProduction");
const withSpinner = require("../../../../../core/hoc/withSpinner");
const Colors = require("../Utils/Colors");

const showColumnsPlayers = [
  "ID",
  "NAME",
  "COUNTRY",
  "PLAYED",
  "GOALS",
  //"?",
  "PENALTIES",
  "YELLOW_CARD",
  "YELLOW_RED_CARD",
  "RED_CARD",
  "SUB_IN",
  "SUB_OUT",
  "MINUTES"
];

const show = columnName => {
  return showColumnsPlayers.includes(columnName);
};

const formatName = player => {
  return (
    <span>
      {player.lastName}, {player.firstName}
    </span>
  );
};

const formatNumber = value => {
  return value === 0 ? "-" : value;
};

const formatPenalty = (penalties, noGoal) => {
  if (penalties === 0) {
    return "-/-";
  } else {
    return penalties + "/" + (penalties - noGoal);
  }
};

const Players = props => {
  const headerBackground = { ...Colors.oddRow, border: "none" };
  const headerTable = (
    <tr>
      {show("ID") && (
        <td
          style={{
            ...headerBackground,
            textAlign: "right",
            fontWeight: "bold"
          }}
        >
          {props.t("Player_Id")}
        </td>
      )}
      {show("NAME") && (
        <td style={{ ...headerBackground }}>{props.t("Player_Name")}</td>
      )}
      {show("COUNTRY") && (
        <td style={{ ...headerBackground }}>{props.t("Player_Country")}</td>
      )}
      {show("PLAYED") && (
        <td style={{ ...headerBackground }}>{props.t("Player_Game_Played")}</td>
      )}
      {show("GOALS") && (
        <td style={{ ...headerBackground }}>
          {props.t("Player_Goals_Scored")}
        </td>
      )}
      {show("?") && (
        <td style={{ ...headerBackground }}>{props.t("Player_?")}</td>
      )}
      {show("PENALTIES") && (
        <td style={{ ...headerBackground, textAlign: "right" }}>
          {props.t("Player_Penalties")}
        </td>
      )}
      {show("YELLOW_CARD") && (
        <td style={{ ...headerBackground }}>{props.t("Player_Yellow")}</td>
      )}
      {show("YELLOW_RED_CARD") && (
        <td style={{ ...headerBackground }}>{props.t("Player_YellowRed")}</td>
      )}
      {show("RED_CARD") && (
        <td style={{ ...headerBackground }}>{props.t("Player_Red")}</td>
      )}
      {show("SUB_IN") && (
        <td style={{ ...headerBackground }}>{props.t("Player_SubsIn")}</td>
      )}
      {show("SUB_OUT") && (
        <td style={{ ...headerBackground }}>{props.t("Player_SubsOut")}</td>
      )}
      {show("MINUTES") && (
        <td style={{ ...headerBackground, textAlign: "right" }}>
          {props.t("Player_Minutes")}
        </td>
      )}
    </tr>
  );
  const matches = props.players.map((el, index) => {
    if (el.player === null) {
      return null;
    }
    let tdBackground =
      index % 2 === 0 ? { ...Colors.evenRow } : { ...Colors.oddRow };
    let fupaTd = { ...tdBackground, border: "none" };
    return (
      <tr key={index}>
        {show("ID") && (
          <td
            style={{
              ...fupaTd,
              textAlign: "right",
              fontWeight: "bold"
            }}
          >
            {index + 1}.
          </td>
        )}
        {show("NAME") && (
          <td style={{ ...fupaTd }}>
            {formatName(el.player)} (<span>{el.player.jerseyNumber}</span>)
          </td>
        )}
        {show("COUNTRY") && (
          <td style={{ ...fupaTd }}>
            <img
              src={
                "https://www.fupa.net/fupa/images/laenderfahnen/" +
                el.player.nationality +
                ".png"
              }
              alt="DE"
            />
          </td>
        )}
        {show("PLAYED") && (
          <td style={{ ...fupaTd, fontWeight: "bold", textAlign: "right" }}>
            {formatNumber(el.statistics.matchesPlayed)}
          </td>
        )}
        {show("GOALS") && (
          <td style={{ ...fupaTd, textAlign: "right" }}>
            {formatNumber(el.statistics.goals)}
          </td>
        )}
        {show("?") && (
          <td style={{ ...fupaTd, textAlign: "right" }}>
            {formatNumber(el.statistics.scores)}
          </td>
        )}
        {show("PENALTIES") && (
          <td style={{ ...fupaTd, textAlign: "right" }}>
            {formatPenalty(
              el.statistics.penaltySpots,
              el.statistics.penaltySpotsNoGoal
            )}
          </td>
        )}
        {show("YELLOW_CARD") && (
          <td style={{ ...fupaTd, textAlign: "right" }}>
            {formatNumber(el.statistics.yellowCards)}
          </td>
        )}
        {show("YELLOW_RED_CARD") && (
          <td style={{ ...fupaTd, textAlign: "right" }}>
            {formatNumber(el.statistics.yellowRedCards)}
          </td>
        )}
        {show("YELLOW_RED_CARD") && (
          <td style={{ ...fupaTd, textAlign: "right" }}>
            {formatNumber(el.statistics.redCards)}
          </td>
        )}
        {show("SUB_IN") && (
          <td style={{ ...fupaTd, textAlign: "right" }}>
            {formatNumber(el.statistics.substitutesIn)}
          </td>
        )}
        {show("SUB_OUT") && (
          <td style={{ ...fupaTd, textAlign: "right" }}>
            {formatNumber(el.statistics.substitutesOut)}
          </td>
        )}
        {show("MINUTES") && (
          <td style={{ ...fupaTd, textAlign: "right" }}>
            {formatNumber(el.statistics.minutes)}
          </td>
        )}
      </tr>
    );
  });

  return (
    <React.Fragment>
      {headerTable}
      {matches}
    </React.Fragment>
  );
};

module.exports = withSpinner(
  withProduction(withNamespaces("fupa")(Players), "Players")
);
