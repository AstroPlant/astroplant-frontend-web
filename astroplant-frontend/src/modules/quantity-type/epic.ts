import { Epic, combineEpics } from "redux-observable";
import { switchMap, map, filter, catchError, reduce } from "rxjs/operators";
import { of } from "rxjs";
import * as genericActions from "~/modules/generic/actions";
import * as actions from "./actions";

import { api, schemas } from "~/api";

const fetchQuantityTypes: Epic = (actions$, _state$) =>
  actions$.pipe(
    filter(genericActions.pageInitializationSuccess.match),
    switchMap(() =>
      api.listQuantityTypes({}, { recursePages: true }).pipe(
        map((response) => response.data),
        reduce(
          (all, quantityTypes) => all.concat(quantityTypes),
          [] as Array<schemas["QuantityType"]>
        ),
        map(actions.addQuantityTypes),
        catchError((_err) => {
          return of(genericActions.setApiConnectionFailed(true));
        })
      )
    )
  );

export default combineEpics(fetchQuantityTypes);
