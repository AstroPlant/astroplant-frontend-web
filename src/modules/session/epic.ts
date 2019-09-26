import { combineEpics, ofType } from "redux-observable";
import { combineLatest } from "rxjs";
import { map, filter } from "rxjs/operators";
import { REHYDRATE } from "redux-persist/lib/constants";
import * as actions from "./actions";

/**
 * Listens to session rehydration, and emit a session initialize action if the
 * session is new.
 */
const sessionInitializeEpic = (action$: any, state$: any) =>
  combineLatest(
    action$.pipe(
      ofType(REHYDRATE),
      filter((action: any) => action.key === "root")
    ),
    action$.pipe(
      ofType(REHYDRATE),
      filter((action: any) => action.key === "channels")
    ),
    action$.pipe(
      ofType(REHYDRATE),
      filter((action: any) => action.key === "session")
    )
  ).pipe(
    filter(() => !state$.value.session.initialized),
    map(() => actions.sessionInitialize())
  );

export default combineEpics(sessionInitializeEpic);
