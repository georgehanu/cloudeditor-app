const { createActions } = require("redux-actions");
const actionTypes = require("./actionTypes");

const actionCreators = createActions(
  actionTypes.CHANGE_SEARCH_VALUE,
  actionTypes.FETCH_CLUBS,
  actionTypes.FETCH_CLUBS_FULFILLED,
  actionTypes.FETCH_CLUBS_FAILED,
  actionTypes.CHANGE_CURRENT_CLUB,
  actionTypes.FETCH_CLUB_TEAMS_FULFILLED,
  actionTypes.FETCH_CLUB_TEAMS_FAILED,
  actionTypes.CHANGE_CURRENT_TEAM,
  actionTypes.BACK_TO_SEARCH,
  actionTypes.FETCH_TEAM_STANDINGS_FULFILLED,
  actionTypes.FETCH_TEAM_STANDINGS_FAILED,
  actionTypes.FETCH_TEAM_MATCHES_FULFILLED,
  actionTypes.FETCH_TEAM_MATCHES_FAILED,
  actionTypes.FETCH_TEAM_PLAYERS_FULFILLED,
  actionTypes.FETCH_TEAM_PLAYERS_FAILED
);

module.exports = actionCreators;
