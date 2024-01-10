import { Epic, StateObservable, combineEpics } from "redux-observable";
import { of, concat, EMPTY } from "rxjs";
import { switchMap, map, filter, catchError } from "rxjs/operators";

import { api } from "~/api";
import * as actions from "./actions";
import * as authActions from "../auth/actions";
import * as genericActions from "../generic/actions";
import { RootState } from "~/store";

/**
 * Listens to authentication token change to fetch our user details.
 */
const fetchUserDetailsEpic: Epic = (action$, _state$) =>
  action$.pipe(
    filter(authActions.setAccessToken.match),
    switchMap(() => {
      return api.showMe().pipe(
        map((resp) => resp.data.username),
        catchError((err) => {
          console.warn("error fetching user details", err);
          return EMPTY;
        }),
      );
    }),
    map(actions.setUsername),
  );

/**
 * Listens to user details change and kit creation to fetch our kit memberships.
 */
const fetchUserKitsEpic: Epic = (
  actions$,
  state$: StateObservable<RootState>,
) =>
  actions$.pipe(
    filter(
      (action) =>
        actions.setUsername.match(action) || actions.kitCreated.match(action),
    ),
    switchMap(() =>
      concat(
        of(actions.loadingKitMemberships()),
        api
          .showUserKitMemberships({
            username: state$.value.me.username!,
          })
          .pipe(
            map((resp) => resp.data),
            map(actions.setKitMemberships),
            catchError((_err) =>
              of(genericActions.setApiConnectionFailed(true)),
            ),
          ),
      ),
    ),
  );

export default combineEpics(fetchUserDetailsEpic, fetchUserKitsEpic);
