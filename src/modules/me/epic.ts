import { isActionOf } from "typesafe-actions";
import { Epic, combineEpics } from "redux-observable";
import { of, concat, EMPTY } from "rxjs";
import { switchMap, map, filter, catchError } from "rxjs/operators";
import * as actions from "./actions";
import * as authActions from "../auth/actions";

import { MeApi } from "astroplant-api";
import { AuthConfiguration, requestWrapper } from "utils/api";

/**
 * Listens to authentication token change, and fetch our user details.
 */
const fetchUserDetailsEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(authActions.setAuthenticationToken)),
    map(_action => new MeApi(AuthConfiguration.Instance)),
    switchMap(api =>
      api.showMe().pipe(
        requestWrapper(),
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
      concat(
        of(actions.loadingKitMemberships()),
        api.showMyKitMemberships().pipe(
          requestWrapper(),
          map(resp => resp),
          map(actions.setKitMemberships),
          catchError(err => EMPTY)
        )
      )
    )
  );

export default combineEpics(fetchUserDetailsEpic, fetchUserKitsEpic);
