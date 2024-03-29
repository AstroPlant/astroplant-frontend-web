import { combineEpics, ofType } from "redux-observable";
import { combineLatest } from "rxjs";
import { map, filter, delay } from "rxjs/operators";
import { REHYDRATE } from "redux-persist/lib/constants";
import * as actions from "./actions";
import { AppEpic } from "~/store";

/**
 * Listens to session rehydration, and emit a session initialize action if the
 * session is new.
 */
const sessionInitializeEpic: AppEpic = (action$: any, state$: any) =>
  combineLatest(
    action$.pipe(
      ofType(REHYDRATE),
      filter((action: any) => action.key === "auth"),
    ),
    action$.pipe(
      ofType(REHYDRATE),
      filter((action: any) => action.key === "session"),
    ),
  ).pipe(
    map(() =>
      state$.value.session.initialized
        ? actions.sessionInitialized()
        : actions.sessionInitialize(),
    ),
  );

/**
 * Hacky epic to emit session initialized after delay.
 */
const sessionInitializedEpic: AppEpic = (action$: any) =>
  action$.pipe(
    filter(actions.sessionInitialize.match),
    delay(10),
    map(() => actions.sessionInitialized()),
  );

export default combineEpics(sessionInitializeEpic, sessionInitializedEpic);
