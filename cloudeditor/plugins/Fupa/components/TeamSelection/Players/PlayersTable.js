const React = require("react");
const Colors = require("../Utils/Colors");
const TableStyles = require("../Utils/TableStyles");
const { mergeDeepRight } = require("ramda");

const showColumnsPlayers = [
  "ID",
  "NAME",
  "PLAYED",
  "GOALS",
  "ASSISTS",
  "YELLOW_CARD",
  "YELLOW_RED_CARD",
  "RED_CARD",
  "TOP_ELEVEN"
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

const formatJerseyNumber = player => {
  return player.playerRole.seasons[0].jerseyNumber;
};

const formatNumber = value => {
  return value === 0 ? "-" : value;
};

const formatGamesPlayer = player => {
  return formatNumber(player.playerRole.total.matches);
};

const formatGoals = player => {
  return formatNumber(player.playerRole.total.goals);
};

const formatAssists = player => {
  return formatNumber(player.playerRole.total.assists);
};

const formatYellowCard = player => {
  return formatNumber(player.playerRole.total.yellowCard);
};

const formatYellowRedCard = player => {
  return formatNumber(player.playerRole.total.yellowRedCard);
};

const formatRedCard = player => {
  return formatNumber(player.playerRole.total.redCard);
};

const formatTopEleven = player => {
  return player.playerRole.total.topEleven;
};

const PlayersTable = ({ tableStyle = "default", ...props }) => {
  let thisStyle = TableStyles.Players.default;
  if (tableStyle !== "default") {
    thisStyle = mergeDeepRight(
      TableStyles.Players.default,
      TableStyles.Players[tableStyle]
    );
  }
  const tblStyle = thisStyle.tableStyle;
  const tbodyStyle = thisStyle.tbodyStyle;
  const fupaTdBase = thisStyle.fupaTdBase;
  const headerBackground = { ...fupaTdBase, ...Colors.oddRow };
  const headerTable = (
    <tr>
      {show("ID") && (
        <td
          style={{
            ...headerBackground,
            ...thisStyle.cols[1]
          }}
        >
          {props.t("Player_Id")}
        </td>
      )}
      {show("NAME") && (
        <td style={{ ...headerBackground, ...thisStyle.cols[2] }}>
          {props.t("Player_Name")}
        </td>
      )}
      {show("PLAYED") && (
        <td style={{ ...headerBackground }}>{props.t("Player_Game_Played")}</td>
      )}
      {show("GOALS") && (
        <td style={{ ...headerBackground }}>
          {props.t("Player_Goals_Scored")}
        </td>
      )}
      {show("ASSISTS") && (
        <td style={{ ...headerBackground }}>{props.t("Player_Assists")}</td>
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
      {show("TOP_ELEVEN") && (
        <td style={{ ...headerBackground }}>{props.t("Player_TopEleven")}</td>
      )}
    </tr>
  );
  const matches = props.players.map((player, index) => {
    if (player === null) {
      return null;
    }
    let tdBackground =
      index % 2 === 0 ? { ...Colors.evenRow } : { ...Colors.oddRow };
    let fupaTd = { ...fupaTdBase, ...tdBackground };
    return (
      <tr key={index}>
        {show("ID") && (
          <td
            style={{
              ...fupaTd,
              ...thisStyle.cols[1]
            }}
          >
            {index + 1}.
          </td>
        )}
        {show("NAME") && (
          <td style={{ ...fupaTd, ...thisStyle.cols[2] }}>
            {formatName(player)} (<span>{formatJerseyNumber(player)}</span>)
          </td>
        )}
        {show("PLAYED") && (
          <td style={{ ...fupaTd, ...thisStyle.cols[3] }}>
            {formatGamesPlayer(player)}
          </td>
        )}
        {show("GOALS") && <td style={{ ...fupaTd }}>{formatGoals(player)}</td>}
        {show("ASSISTS") && (
          <td style={{ ...fupaTd }}>{formatAssists(player)}</td>
        )}

        {show("YELLOW_CARD") && (
          <td style={{ ...fupaTd }}>{formatYellowCard(player)}</td>
        )}
        {show("YELLOW_RED_CARD") && (
          <td style={{ ...fupaTd }}>{formatYellowRedCard(player)}</td>
        )}
        {show("YELLOW_RED_CARD") && (
          <td style={{ ...fupaTd }}>{formatRedCard(player)}</td>
        )}
        {show("TOP_ELEVEN") && (
          <td style={{ ...fupaTd }}>{formatTopEleven(player)}</td>
        )}
      </tr>
    );
  });

  return (
    <React.Fragment>
      <table style={{ ...tblStyle }}>
        <tbody style={{ ...tbodyStyle }}>
          {headerTable}
          {matches}
        </tbody>
      </table>
    </React.Fragment>
  );
};

module.exports = PlayersTable;
