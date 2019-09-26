import { combineEpics, ofType } from "redux-observable";
import { mergeMap, tap, switchMap, map, filter, delay } from "rxjs/operators";
import { from, of } from "rxjs";
import * as actions from "./actions";
import * as types from "./actionTypes";
import { UserApi } from "api";

import { SESSION_INITIALIZE } from "../session/actionTypes";

/**
 * Listens to session initialization, and clear the authentication token if we
 * do not want to be remembered.
 */
const clearTokenEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(SESSION_INITIALIZE),
    filter(() => !state$.value.auth.rememberMe),
    map(actions.clearJwt)
  );

const signUpEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(types.AUTH_SIGN_UP_REQUEST),
    switchMap((action: types.SignUpRequestAction) => {
      const userApi = new UserApi();
      return from(
        userApi.createUser(action.payload)
      );
    })
  );

export default combineEpics(clearTokenEpic);
