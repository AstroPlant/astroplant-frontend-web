import { isActionOf, getType } from "typesafe-actions";
import { combineEpics, ofType } from "redux-observable";
import { mergeMap, tap, switchMap, map, filter, delay } from "rxjs/operators";
import { from, of } from "rxjs";
import * as actions from "./actions";
import { UserApi } from "api";

import { sessionInitialize } from "../session/actions";

/**
 * Listens to session initialization, and clear the refresh token if we do not
 * want to be remembered.
 */
const clearRefreshTokenEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(getType(sessionInitialize)),
    //isActionOf(sessionInitialize),
    filter(() => !state$.value.auth.rememberMe),
    map(actions.clearRefreshToken)
  );

export default combineEpics(clearRefreshTokenEpic);
