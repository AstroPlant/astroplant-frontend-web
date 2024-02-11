import { combineEpics } from "redux-observable";
import { EMPTY } from "rxjs";
import { switchMap, map, filter, catchError } from "rxjs/operators";

import { api } from "~/api";
import * as actions from "./actions";
import * as authActions from "../auth/actions";
import { AppEpic } from "~/store";

/**
 * Listens to authentication token change to fetch our user details.
 */
const fetchUserDetailsEpic: AppEpic = (action$, _state$) =>
  action$.pipe(
    filter(authActions.setAccessToken.match),
    switchMap(() => {
      return api.showMe().pipe(
        map((resp) => resp.data.username),
        catchError((err) => {
          console.warn("error fetching user details", err);
          return EMPTY;
        }),
      );
    }),
    map(actions.setUsername),
  );

export default combineEpics(fetchUserDetailsEpic);
