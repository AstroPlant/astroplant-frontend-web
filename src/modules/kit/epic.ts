import { isActionOf } from "typesafe-actions";
import { Epic, combineEpics } from "redux-observable";
import { from, of, concat, EMPTY, timer } from "rxjs";
import {
  mergeMap,
  switchMap,
  map,
  filter,
  catchError,
  takeUntil
} from "rxjs/operators";
import * as actions from "./actions";
import * as meActions from "../me/actions";
import * as genericActions from "../generic/actions";

import { KitsApi } from "astroplant-api";
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

const fetchKit: Epic = (actions$, state$) =>
  actions$.pipe(
    filter(isActionOf(actions.fetchKit)),
    map(action => action.payload.serial),
    map(kitSerial => {
      const api = new KitsApi(AuthConfiguration.Instance);
      return { serial: kitSerial, req: api.showKitBySerial({ kitSerial }) };
    }),
    mergeMap(({ serial, req }) =>
      req.pipe(
        requestWrapper(),
        map(kit => actions.addKit(kit)),
        catchError(err => of(genericActions.setApiConnectionFailed(true)))
      )
    )
  );

const kitWatching: Epic = (actions$, state$) =>
  actions$.pipe(
    filter(isActionOf(actions.startWatching)),
    map(action => action.payload.serial),
    mergeMap(serial =>
      timer(0, 60 * 1000).pipe(
        mergeMap(() =>
          concat(of(actions.kitConfigurationsRequest({ serial })))
        ),
        takeUntil(
          actions$.pipe(
            filter(isActionOf(actions.stopWatching)),
            filter(action => action.payload.serial === serial)
          )
        )
      )
    )
  );

const kitConfigurationsRequest: Epic = (actions$, state$) =>
  actions$.pipe(
    filter(isActionOf(actions.kitConfigurationsRequest)),
    map(action => action.payload.serial),
    map(kitSerial => {
      const api = new KitsApi(AuthConfiguration.Instance);
      return { serial: kitSerial, req: api.listConfigurations({ kitSerial }) };
    }),
    mergeMap(({ serial, req }) =>
      req.pipe(
        map(configurations =>
          actions.kitConfigurationsSuccess({ serial, configurations })
        ),
        catchError(err => of(genericActions.setApiConnectionFailed(true)))
      )
    )
  );

export default combineEpics(
  addKitFromKitMemberships,
  fetchKit,
  kitWatching,
  kitConfigurationsRequest
);
