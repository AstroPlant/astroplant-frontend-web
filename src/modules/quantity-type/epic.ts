import { isActionOf } from "typesafe-actions";
import { Epic, combineEpics } from "redux-observable";
import { switchMap, map, filter, catchError } from "rxjs/operators";
import { EMPTY, of } from "rxjs";
import * as genericActions from "modules/generic/actions";
import * as actions from "./actions";

import { QuantityTypeApi } from "astroplant-api";
import { walkPages } from "utils/api";

const fetchQuantityTypes: Epic = (actions$, state$) =>
  actions$.pipe(
    filter(isActionOf(genericActions.pageInitializationSuccess)),
    map(() => new QuantityTypeApi()),
    switchMap((api: QuantityTypeApi) =>
      walkPages(page =>
        api.listQuantityTypes({
          after: page
        })
      ).pipe(
        map(actions.addQuantityTypes),
        catchError(err => of(genericActions.setApiConnectionFailed(true)))
      )
    )
  );

export default combineEpics(fetchQuantityTypes);
