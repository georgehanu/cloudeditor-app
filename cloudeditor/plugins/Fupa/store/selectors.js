const { pathOr } = require("ramda");
const { isEmpty, isNil, propEq, find, defaultTo, pipe } = require("ramda");
const {
  createSelectorWithDependencies: createSelector
} = require("reselect-tools");

const searchValueSelector = state =>
  pathOr(null, ["fupa", "searchValue"], state);
const currentClubSelector = state =>
  pathOr(null, ["fupa", "currentClub"], state);
const currentTeamSelector = state =>
  pathOr(null, ["fupa", "currentTeam"], state);
const clubsSelector = state => pathOr(null, ["fupa", "clubs"], state);
const teamsSelector = state => pathOr(null, ["fupa", "teams"], state);
const clubsStateSelector = state => pathOr(null, ["fupa", "clubsState"], state);
const teamsStateSelector = state => pathOr(null, ["fupa", "teamsState"], state);
const teamStandingsStateSelector = state =>
  pathOr(null, ["fupa", "teamStandingsState"], state);
const teamStandingsSelector = state =>
  pathOr([], ["fupa", "teamStandings"], state);
const teamMatchesStateSelector = state =>
  pathOr(null, ["fupa", "teamMatchesState"], state);
const teamMatchesSelector = state => pathOr([], ["fupa", "teamMatches"], state);
const teamPlayersStateSelector = state =>
  pathOr(null, ["fupa", "teamPlayersState"], state);
const teamPlayersSelector = state => pathOr([], ["fupa", "teamPlayers"], state);

const teamSelector = createSelector(
  [teamsSelector, currentTeamSelector],
  (teams, teamId) => {
    if (isNil(teamId)) return {};
    return pipe(
      find(propEq("id", teamId)),
      defaultTo({})
    )(teams);
  }
);

const teamCompetitionSelector = createSelector(
  [teamSelector],
  team => {
    return team.competition.slug;
  }
);

module.exports = {
  searchValueSelector,
  currentClubSelector,
  currentTeamSelector,
  clubsSelector,
  teamsSelector,
  clubsStateSelector,
  teamsStateSelector,
  teamStandingsStateSelector,
  teamStandingsSelector,
  teamSelector,
  teamCompetitionSelector,
  teamMatchesStateSelector,
  teamMatchesSelector,
  teamPlayersStateSelector,
  teamPlayersSelector
};
