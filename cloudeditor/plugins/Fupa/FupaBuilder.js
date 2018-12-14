const React = require("react");
const { connect } = require("react-redux");
const { isEmpty, isNil, propEq, find, defaultTo, pipe } = require("ramda");
const {
  createSelectorWithDependencies: createSelector
} = require("reselect-tools");
const ClubsSearch = require("./components/ClubsSearch/ClubsSearch");
const ClubSelection = require("./components/ClubSelection/ClubSelection");
const ClubTeams = require("./components/ClubTeams/ClubTeams");
const TeamSelection = require("./components/TeamSelection/TeamSelection");
const {
  currentClubSelector,
  currentTeamSelector,
  clubsSelector,
  teamsSelector,
  clubsStateSelector,
  teamsStateSelector,
  teamStandingsSelector,
  teamStandingsStateSelector,
  teamSelector,
  teamMatchesSelector,
  teamMatchesStateSelector,
  teamPlayersSelector,
  teamPlayersStateSelector
} = require("./store/selectors");
const {
  changeCurrentClub,
  changeCurrentTeam,
  backToSearch
} = require("./store/actions");
require("./Fupa.css");

class FupaBuilder extends React.Component {
  render() {
    const { clubSelection, clubTeams, teamSelection } = this.props;
    return (
      <div className="fupa">
        <ClubsSearch />
        <ClubSelection
          {...clubSelection}
          limit={15}
          selected={this.props.selectClub}
        />
        <ClubTeams
          {...clubTeams}
          limit={99}
          backToSearch={this.props.backToSearch}
          selected={this.props.changeCurrentTeam}
        />
        <TeamSelection
          {...teamSelection}
          changed={this.props.changeCurrentTeam}
          teamStandings={this.props.teamStandings}
          teamMatches={this.props.teamMatches}
          teamPlayers={this.props.teamPlayers}
        />
      </div>
    );
  }
}

const clubSelector = createSelector(
  [clubsSelector, currentClubSelector],
  (clubs, clubId) => {
    if (isNil(clubId)) return {};
    return pipe(
      find(propEq("slug", clubId)),
      defaultTo({})
    )(clubs);
  }
);

const clubSelectionSelector = createSelector(
  [clubsSelector, clubSelector, clubsStateSelector],
  (clubs, club, state) => {
    return {
      clubs,
      loading: state.loading || false,
      error: state.error || false,
      hide: !isEmpty(club)
    };
  }
);

const clubTeamsSelector = createSelector(
  [
    clubsSelector,
    clubSelector,
    teamsSelector,
    teamSelector,
    teamsStateSelector
  ],
  (clubs, club, teams, team, state) => {
    return {
      club,
      teams,
      loading: state.loading || false,
      error: state.error || false,
      hide: isEmpty(club) || !isEmpty(team)
    };
  }
);

const teamSelectionSelector = createSelector(
  [clubSelector, teamsSelector, teamSelector, teamsStateSelector],
  (club, teams, team, state) => {
    return {
      club,
      teams,
      team,
      loading: state.loading || false,
      error: state.error || false,
      hide: isEmpty(club) || isEmpty(team)
    };
  }
);

const standingsSelector = createSelector(
  [teamStandingsSelector, teamStandingsStateSelector, currentTeamSelector],
  (standings, state, teamId) => {
    return {
      standings,
      loading: state.loading || false,
      error: state.error || false,
      teamId
      //hide: isEmpty(club) || isEmpty(team)
    };
  }
);

const matchesSelector = createSelector(
  [teamMatchesSelector, teamMatchesStateSelector, currentTeamSelector],
  (matches, state, teamId) => {
    return {
      matches,
      loading: state.loading || false,
      error: state.error || false,
      teamId
    };
  }
);

const playersSelector = createSelector(
  [teamPlayersSelector, teamPlayersStateSelector, currentTeamSelector],
  (players, state, teamId) => {
    return {
      players,
      loading: state.loading || false,
      error: state.error || false,
      teamId
    };
  }
);

const mapStateToProps = state => {
  return {
    clubSelection: clubSelectionSelector(state),
    clubTeams: clubTeamsSelector(state),
    teamSelection: teamSelectionSelector(state),
    teamStandings: standingsSelector(state),
    teamMatches: matchesSelector(state),
    teamPlayers: playersSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectClub: value => dispatch(changeCurrentClub(value)),
    changeCurrentTeam: team => dispatch(changeCurrentTeam({ team })),
    backToSearch: () => dispatch(backToSearch())
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(FupaBuilder);
