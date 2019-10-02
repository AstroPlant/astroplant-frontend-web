import { isActionOf } from "typesafe-actions";
import { Epic, combineEpics } from "redux-observable";
import { from, of, concat, EMPTY } from "rxjs";
import { switchMap, map, filter, catchError } from "rxjs/operators";
import * as actions from "./actions";
import * as meActions from "../me/actions";

import { MeApi } from "astroplant-api";
import { AuthConfiguration, requestWrapper } from "utils/api";

const addKitFromKitMemberships: Epic = (actions$, state$) =>
  actions$.pipe(
    filter(isActionOf(meActions.setKitMemberships)),
    map(action => action.payload),
    switchMap(kitMemberships =>
      from(kitMemberships.map(kitMembership => kitMembership.kit))
    ),
    map(actions.addKit)
  );

export default combineEpics(addKitFromKitMemberships);
