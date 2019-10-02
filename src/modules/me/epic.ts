import { isActionOf } from "typesafe-actions";
import { Epic, combineEpics } from "redux-observable";
import { switchMap, map, filter, catchError, retry } from "rxjs/operators";
import { from, EMPTY } from "rxjs";
import * as actions from "./actions";
import * as authActions from "../auth/actions";

import { MeApi, Configuration } from "astroplant-api";
import { AuthConfiguration } from "ApiAuth";

/**
 * Listens to authentication token change, and fetch our user details.
 */
const fetchUserDetailsEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(authActions.setAuthenticationToken)),
    map(_action => new MeApi(AuthConfiguration.Instance)),
    switchMap(api =>
      api.showMe().pipe(
        retry(3),
        map(resp => resp),
        catchError(err => {
          console.warn("errrr", err);
          return EMPTY;
        })
      )
    ),
    map(actions.setDetails)
  );

const fetchUserKitsEpic: Epic = (actions$, state$) =>
  actions$.pipe(
    filter(
      isActionOf([authActions.setAuthenticationToken, actions.kitCreated])
    ),
    map(_action => new MeApi(AuthConfiguration.Instance)),
    switchMap(api =>
      api.showMyKitMemberships().pipe(
        retry(3),
        map(resp => resp),
        map(actions.setKitMemberships),
        catchError(err => EMPTY)
      )
    )
  );

export default combineEpics(fetchUserDetailsEpic, fetchUserKitsEpic);
