import { Epic, combineEpics } from "redux-observable";
import { of, concat, EMPTY } from "rxjs";
import { switchMap, map, filter, catchError } from "rxjs/operators";

import { api } from "~/api";
import * as actions from "./actions";
import * as authActions from "../auth/actions";
import * as genericActions from "../generic/actions";

/**
 * Listens to authentication token change to fetch our user details.
 */
const fetchUserDetailsEpic: Epic = (action$, _state$) =>
  action$.pipe(
    filter(authActions.setAccessToken.match),
    switchMap(() => {
      console.warn("FETCH USER DETAILS");

      return api.showMe().pipe(
        map((resp) => resp.data),
        catchError((err) => {
          console.warn("error fetching user details", err);
          return EMPTY;
        })
      );
    }),
    map(actions.setDetails)
  );

/**
 * Listens to user details change and kit creation to fetch our kit memberships.
 */
const fetchUserKitsEpic: Epic = (actions$, state$) =>
  actions$.pipe(
    filter(
      (action) =>
        actions.setDetails.match(action) || actions.kitCreated.match(action)
    ),
    switchMap(() =>
      concat(
        of(actions.loadingKitMemberships()),
        api
          .showUserKitMemberships({
            username: state$.value.me.details.username,
          })
          .pipe(
            map((resp) => resp.data),
            map(actions.setKitMemberships),
            catchError((_err) =>
              of(genericActions.setApiConnectionFailed(true))
            )
          )
      )
    )
  );

export default combineEpics(fetchUserDetailsEpic, fetchUserKitsEpic);
