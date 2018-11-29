import React from "react";
import { withNamespaces } from "react-i18next";
import withProduction from "../../../hoc/withProduction";
import withSpinner from "../../../../../hoc/withSpinner";

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
  //"SUB_IN",
  //"SUB_OUT",
  "MINUTES"
];

const show = columnName => {
  return showColumnsPlayers.includes(columnName);
};

const formatName = name => {
  const names = name.split(" ");
  if (names.length === 1) {
    return <span>{names[0]}</span>;
  } else {
    return (
      <span>
        {names[1]}, {names[0]}
      </span>
    );
  }
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
  const headerTable = (
    <tr>
      {show("ID") && (
        <td style={{ textAlign: "right", fontWeight: "bold" }}>
          {props.t("Player_Id")}
        </td>
      )}
      {show("NAME") && <td>{props.t("Player_Name")}</td>}
      {show("COUNTRY") && <td>{props.t("Player_Country")}</td>}
      {show("PLAYED") && <td>{props.t("Player_Game_Played")}</td>}
      {show("GOALS") && <td>{props.t("Player_Goals_Scored")}</td>}
      {show("?") && <td>{props.t("Player_?")}</td>}
      {show("PENALTIES") && <td>{props.t("Player_Penalties")}</td>}
      {show("YELLOW_CARD") && <td>{props.t("Player_Yellow")}</td>}
      {show("YELLOW_RED_CARD") && <td>{props.t("Player_YellowRed")}</td>}
      {show("RED_CARD") && <td>{props.t("Player_Red")}</td>}
      {show("SUB_IN") && <td>{props.t("Player_SubsIn")}</td>}
      {show("SUB_OUT") && <td>{props.t("Player_SubsOut")}</td>}
      {show("MINUTES") && <td>{props.t("Player_Minutes")}</td>}
    </tr>
  );
  const matches = props.players.map((el, index) => {
    if (el.player === null) {
      return null;
    }
    return (
      <tr key={index}>
        {show("ID") && (
          <td style={{ textAlign: "right", fontWeight: "bold" }}>
            {index + 1}.
          </td>
        )}
        {show("NAME") && (
          <td>
            {formatName(el.player.name)} (<span>{el.player.jerseyNumber}</span>)
          </td>
        )}
        {show("COUNTRY") && (
          <td>
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
          <td style={{ fontWeight: "bold", textAlign: "right" }}>
            {formatNumber(el.statistics.matchesPlayed)}
          </td>
        )}
        {show("GOALS") && <td>{formatNumber(el.statistics.goals)}</td>}
        {show("?") && <td>{formatNumber(el.statistics.scores)}</td>}
        {show("PENALTIES") && (
          <td>
            {formatPenalty(
              el.statistics.penaltySpots,
              el.statistics.penaltySpotsNoGoal
            )}
          </td>
        )}
        {show("YELLOW_CARD") && (
          <td>{formatNumber(el.statistics.yellowCards)}</td>
        )}
        {show("YELLOW_RED_CARD") && (
          <td>{formatNumber(el.statistics.yellowRedCards)}</td>
        )}
        {show("YELLOW_RED_CARD") && (
          <td>{formatNumber(el.statistics.redCards)}</td>
        )}
        {show("SUB_IN") && <td>{formatNumber(el.statistics.substitutesIn)}</td>}
        {show("SUB_OUT") && (
          <td>{formatNumber(el.statistics.substitutesOut)}</td>
        )}
        {show("MINUTES") && (
          <td style={{ textAlign: "right" }}>
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

export default withSpinner(
  withProduction(withNamespaces("fupa")(Players), "Players")
);
