import { isActionOf } from "typesafe-actions";
import { Epic, combineEpics } from "redux-observable";
import { of, concat, EMPTY } from "rxjs";
import { switchMap, map, filter, catchError } from "rxjs/operators";
import * as actions from "./actions";
import * as authActions from "../auth/actions";
import * as genericActions from "../generic/actions";

import { AccessApi, UsersApi } from "astroplant-api";
import { AuthConfiguration, requestWrapper } from "utils/api";

/**
 * Listens to authentication token change, and fetch our user details.
 */
const fetchUserDetailsEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(authActions.setAccessToken)),
    map((_action) => new AccessApi(AuthConfiguration.Instance)),
    switchMap((api) =>
      api.showMe().pipe(
        requestWrapper(),
        map((resp) => resp),
        catchError((err) => {
          console.warn("error fetching user details", err);
          return EMPTY;
        })
      )
    ),
    map(actions.setDetails)
  );

const fetchUserKitsEpic: Epic = (actions$, state$) =>
  actions$.pipe(
    filter(isActionOf([actions.setDetails, actions.kitCreated])),
    map((_action) => new UsersApi(AuthConfiguration.Instance)),
    switchMap((api) =>
      concat(
        of(actions.loadingKitMemberships()),
        api
          .showUserKitMemberships({
            username: state$.value.me.details.unwrap().username,
          })
          .pipe(
            requestWrapper(),
            map((resp) => resp),
            map(actions.setKitMemberships),
            catchError((err) => of(genericActions.setApiConnectionFailed(true)))
          )
      )
    )
  );

export default combineEpics(fetchUserDetailsEpic, fetchUserKitsEpic);
