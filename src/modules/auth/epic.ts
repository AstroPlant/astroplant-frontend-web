import { isActionOf } from "typesafe-actions";
import { Epic, combineEpics } from "redux-observable";
import { switchMap, map, filter, catchError, retry } from "rxjs/operators";
import { from, timer, EMPTY } from "rxjs";
import * as actions from "./actions";
import { AuthenticateApi } from "astroplant-api";
import { rateLimit } from "utils/api";

import * as sessionActions from "../session/actions";

/**
 * Listens to session initialization, and clear the refresh token if we do not
 * want to be remembered.
 */
const clearRefreshTokenEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(sessionActions.sessionInitialize)),
    filter(() => !state$.value.auth.rememberMe),
    map(actions.clearTokens)
  );

/**
 * Intermittently use the refresh token.
 * TODO: clear refresh token if the server deems it invalid.
 */
const refreshAuthenticationEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(sessionActions.sessionInitialized)),
    switchMap(() => timer(0, 5 * 60 * 1000)),
    filter(() => state$.value.auth.refreshToken),
    map(_action => new AuthenticateApi()),
    switchMap((api: AuthenticateApi) =>
      api
        .obtainAuthenticationTokenFromRefreshToken({
          authRefreshToken: {
            refreshToken: state$.value.auth.refreshToken
          }
        })
        .pipe(
          rateLimit,
          retry(3),
          map(resp => resp),
          map(actions.setAuthenticationToken),
          catchError(err => EMPTY)
        )
    )
  );

export default combineEpics(clearRefreshTokenEpic, refreshAuthenticationEpic);
