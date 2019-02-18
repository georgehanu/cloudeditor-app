const { pathOr } = require("ramda");
const { isNil, propEq, find, defaultTo, pipe } = require("ramda");
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

const teamStandingsQuerySelector = createSelector(
  [teamCompetitionSelector, currentTeamSelector],
  (competition, teamId) => {
    return {
      query: "?action=standings",
      data: {
        competition: competition
      },
      teamId
    };
  }
);

const teamMatchesQuerySelector = createSelector(
  [
    currentClubSelector,
    teamCompetitionSelector,
    teamSelector,
    currentTeamSelector
  ],
  (club, competition, team, teamId) => {
    const teamSlug = team.ageGroup.slug + team.level;
    return {
      query: "?action=matches",
      data: {
        club: club,
        competition: competition,
        team: teamSlug,
        limit: 0
      },
      teamId
    };
  }
);

const teamPlayersQuerySelector = createSelector(
  [currentClubSelector, teamSelector],
  (club, team) => {
    const teamSlug = team.ageGroup.slug + team.level;
    return {
      query: "?action=teamPlayers",
      data: {
        team: teamSlug,
        club: club,
        role: "player",
        orderBy: "-playerRole.total.matches"
      }
    };
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
  teamPlayersSelector,
  teamMatchesQuerySelector,
  teamStandingsQuerySelector,
  teamPlayersQuerySelector
};
