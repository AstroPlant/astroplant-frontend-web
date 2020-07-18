import { Epic, combineEpics } from "redux-observable";
import { switchMap, map, filter, catchError } from "rxjs/operators";
import { of, timer } from "rxjs";
import * as actions from "./actions";
import { AccessApi } from "astroplant-api";
import { requestWrapper } from "utils/api";

import * as sessionActions from "../session/actions";

/**
 * Listens to session initialization, and clear the refresh token if we do not
 * want to be remembered.
 */
const clearRefreshTokenEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(sessionActions.sessionInitialize.match),
    filter(() => !state$.value.auth.rememberMe),
    map(actions.clearTokens)
  );

/**
 * Intermittently use the refresh token.
 * TODO: clear refresh token if the server deems it invalid.
 */
const refreshAuthenticationEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(sessionActions.sessionInitialized.match),
    switchMap(() => timer(0, 5 * 60 * 1000)),
    switchMap(() => {
      if (state$.value.auth.refreshToken) {
        return of(new AccessApi()).pipe(
          switchMap((api: AccessApi) =>
            api
              .obtainAccessTokenFromRefreshToken({
                authRefreshToken: {
                  refreshToken: state$.value.auth.refreshToken
                }
              })
              .pipe(
                requestWrapper(),
                map(resp => resp),
                map(actions.setAccessToken),
                catchError(err => of(actions.notAuthenticated()))
              )
          )
        );
      } else {
        return of(actions.notAuthenticated());
      }
    })
  );

export default combineEpics(clearRefreshTokenEpic, refreshAuthenticationEpic);
