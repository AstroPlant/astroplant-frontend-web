import { isActionOf } from "typesafe-actions";
import { Epic, combineEpics } from "redux-observable";
import { switchMap, map, filter } from "rxjs/operators";
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
      ).pipe(map(actions.addQuantityTypes))
    )
  );

export default combineEpics(fetchQuantityTypes);
