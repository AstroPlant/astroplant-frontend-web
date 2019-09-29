import { isActionOf } from "typesafe-actions";
import { Epic, combineEpics } from "redux-observable";
import {
  tap,
  switchMap,
  map,
  filter,
  catchError
} from "rxjs/operators";
import { from, EMPTY } from "rxjs";
import * as actions from "./actions";
import * as authActions from "../auth/actions";

import { MeApi } from "api";

/**
 * Listens to authentication token change, and fetch our user details.
 */
const fetchUserDetailsEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(authActions.setAuthenticationToken)),
    tap(a => console.warn(a)),
    map(
      _action =>
        new MeApi({ accessToken: state$.value.auth.authenticationToken })
    ),
    switchMap(api =>
      from(api.showMe()).pipe(
        map(resp => resp.data),
        map(actions.setDetails),
        catchError(err => EMPTY)
      )
    )
  );

export default combineEpics(fetchUserDetailsEpic);
