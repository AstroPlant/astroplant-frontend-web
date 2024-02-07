import { Epic, combineEpics } from "redux-observable";
import { from, of } from "rxjs";
import { mergeMap, switchMap, map, filter, catchError } from "rxjs/operators";
import * as actions from "./actions";
import * as meActions from "../me/actions";
import * as genericActions from "../generic/actions";

import { PDNotFound, PDForbidden } from "../../problems";
import { ErrorResponse, api } from "~/api";

const addKitFromKitMemberships: Epic = (actions$, _state$) =>
  actions$.pipe(
    filter(meActions.setKitMemberships.match),
    map((action) => action.payload),
    switchMap((kitMemberships) =>
      from(kitMemberships.map((kitMembership) => kitMembership.kit)),
    ),
    map(actions.addKit),
  );

const fetchKit: Epic = (actions$, _state$) =>
  actions$.pipe(
    filter(actions.fetchKit.match),
    map((action) => action.payload.serial),
    map((kitSerial) => {
      return { serial: kitSerial, req: api.showKitBySerial({ kitSerial }) };
    }),
    mergeMap(({ serial, req }) =>
      req.pipe(
        map((kit) => actions.addKit(kit.data)),
        catchError((err) => {
          if (
            err instanceof ErrorResponse &&
            err.details.type === "APPLICATION"
          ) {
            console.warn(err.details);
            if (PDNotFound.is(err.details.data)) {
              return of(actions.notFound({ serial }));
            } else if (PDForbidden.is(err.details.data)) {
              return of(actions.notAuthorized({ serial }));
            }
          }

          return of(genericActions.setApiConnectionFailed(true));
        }),
      ),
    ),
  );

export default combineEpics(addKitFromKitMemberships, fetchKit);
