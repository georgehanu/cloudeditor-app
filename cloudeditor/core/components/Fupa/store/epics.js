import {
  FETCH_TEAM_MATCHES_FAILED,
  FETCH_TEAM_MATCHES_FULFILLED
} from "../store/actionTypes";
//https://fupa.docs.stoplight.io/api-docs-v1/club/get-one-club
const Rx = require("rxjs");
const { Observable } = require("rxjs");

const { switchMap, catchError, concatMap } = require("rxjs/operators");
const { ofType } = require("redux-observable");

const actionTypes = require("./actionTypes");
const actions = require("./actions");
const axios = require("../axios");
const {
  teamCompetitionSelector,
  teamSelector,
  currentTeamSelector
} = require("./selectors");

module.exports = {
  initSearchEpic: (action$, store) =>
    action$.pipe(
      ofType(actionTypes.CHANGE_SEARCH_VALUE),
      switchMap(action => {
        const { payload } = action;
        return Rx.of(actions.fetchClubs(payload));
      })
    ),
  fetchClubsEpic: action$ =>
    action$.pipe(
      ofType(actionTypes.FETCH_CLUBS),
      switchMap(action => {
        const { payload } = action;
        return Rx.from(
          axios.get("/search/club/" + payload).then(res => res.data)
        ).pipe(
          switchMap(data => {
            if (data.errors === false)
              return Rx.of(actions.fetchClubsFulfilled(data.data));
            return Rx.of(actions.fetchClubsFailed());
          }),
          catchError(error => {
            return Rx.of(actions.fetchClubsFailed());
          })
        );
      })
    ),
  fetchClubTeamsEpic: action$ =>
    action$.pipe(
      ofType(actionTypes.CHANGE_CURRENT_CLUB),
      switchMap(action => {
        const { payload } = action;
        return Rx.from(
          axios
            .get("/teams", {
              params: {
                club: payload,
                additionalFields: "competition,currentRank"
              }
            })
            .then(res => res.data)
        ).pipe(
          switchMap(data => {
            if (data.errors === false)
              return Rx.of(actions.fetchClubTeamsFulfilled(data.data));
            return Rx.of(actions.fetchClubTeamsFailed());
          }),
          catchError(error => {
            return Rx.of(actions.fetchClubTeamsFailed());
          })
        );
      })
    ),
  fetchClubTeamStandingsEpic: (action$, store) =>
    action$.pipe(
      ofType(actionTypes.CHANGE_CURRENT_TEAM),
      switchMap(action => {
        const competition = teamCompetitionSelector(store.value);
        return Rx.from(
          axios
            .get("/standings", {
              params: {
                competition: competition
              }
            })
            .then(res => res.data)
        ).pipe(
          switchMap(data => {
            if (data.errors === false)
              return Rx.of(actions.fetchTeamStandingsFulfilled(data.data));
            return Rx.of(actions.fetchTeamStandingsFailed());
          }),
          catchError(error => {
            return Rx.of(actions.fetchTeamStandingsFailed());
          })
        );
      })
    ),
  fetchClubTeamMatchesEpic: (action$, store) =>
    action$.pipe(
      ofType(actionTypes.CHANGE_CURRENT_TEAM),
      switchMap(action => {
        const competition = teamCompetitionSelector(store.value);
        const team = teamSelector(store.value);
        // we need to make 2 calls - one for the previous games, one for the next games
        return Rx.from(
          axios
            .get("/matches", {
              params: {
                club: team.clubSlug,
                competition: competition,
                section: "PRE",
                limit: 6
              }
            })
            .then(res => res.data)
        ).pipe(
          switchMap(data => {
            if (data.errors === false) {
              return Rx.from(
                axios
                  .get("/matches", {
                    params: {
                      club: team.clubSlug,
                      competition: competition,
                      section: "POST,LIVE",
                      sort: "-kickoff",
                      limit: 6
                    }
                  })
                  .then(res => res.data)
              ).pipe(
                switchMap(postData => {
                  if (postData.errors === false) {
                    return Rx.of(
                      actions.fetchTeamMatchesFulfilled([
                        ...postData.data.reverse(),
                        ...data.data
                      ])
                    );
                  }
                  return Rx.of(actions.fetchTeamMatchesFailed());
                }),
                catchError(error => {
                  return Rx.of(actions.fetchTeamMatchesFailed());
                })
              );
            }
            return Rx.of(actions.fetchTeamMatchesFailed());
          }),
          catchError(error => {
            console.log(error, "ERROR");
            return Rx.of(actions.fetchTeamMatchesFailed());
          })
        );
      })
    ),
  fetchClubTeamPlayersEpic: (action$, store) =>
    action$.pipe(
      ofType(actionTypes.CHANGE_CURRENT_TEAM),
      switchMap(action => {
        const team = currentTeamSelector(store.value);
        return Rx.from(
          axios
            .get("/players", {
              params: {
                team: team
              }
            })
            .then(res => res.data)
        ).pipe(
          switchMap(data => {
            if (data.errors === false)
              return Rx.of(actions.fetchTeamPlayersFulfilled(data.data));

            console.log(data);

            return Rx.of(actions.fetchTeamPlayersFailed());
          }),
          catchError(error => {
            console.log(error);
            return Rx.of(actions.fetchTeamPlayersFulfilled());
          })
        );
      })
    )
};
