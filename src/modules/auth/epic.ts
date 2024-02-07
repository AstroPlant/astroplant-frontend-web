import { combineEpics } from "redux-observable";
import { switchMap, map, filter, catchError } from "rxjs/operators";
import { of, timer } from "rxjs";
import * as actions from "./actions";

import * as sessionActions from "../session/actions";
import { api } from "~/api";
import { AppEpic } from "~/store";

/**
 * Listens to session initialization, and clear the refresh token if we do not
 * want to be remembered.
 */
const clearRefreshTokenEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(sessionActions.sessionInitialize.match),
    filter((_ev) => !state$.value.auth.rememberMe),
    map((_ev) => actions.clearTokens),
  );

/**
 * Intermittently use the refresh token.
 * TODO: clear refresh token if the server deems it invalid.
 */
const refreshAuthenticationEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(sessionActions.sessionInitialized.match),
    switchMap(() => timer(0, 5 * 60 * 1000)),
    switchMap(() => {
      if (state$.value.auth.refreshToken) {
        return api
          .obtainAccessTokenFromRefreshToken({
            authRefreshToken: {
              refreshToken: state$.value.auth.refreshToken,
            },
          })
          .pipe(
            map((response) => response.data),
            map((accessToken) => actions.setAccessToken(accessToken)),
            catchError((_err) => of(actions.notAuthenticated())),
          );
      } else {
        return of(actions.notAuthenticated());
      }
    }),
  );

export default combineEpics(clearRefreshTokenEpic, refreshAuthenticationEpic);
