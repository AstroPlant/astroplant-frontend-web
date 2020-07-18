import { Epic, combineEpics } from "redux-observable";
import { switchMap, map, filter, catchError } from "rxjs/operators";
import { of } from "rxjs";
import * as genericActions from "modules/generic/actions";
import * as actions from "./actions";

import { DefinitionsApi } from "astroplant-api";
import { walkPages } from "utils/api";

const fetchQuantityTypes: Epic = (actions$, state$) =>
  actions$.pipe(
    filter(genericActions.pageInitializationSuccess.match),
    map(() => new DefinitionsApi()),
    switchMap((api: DefinitionsApi) =>
      walkPages((page) =>
        api.listQuantityTypes({
          after: page,
        })
      ).pipe(
        map(actions.addQuantityTypes),
        catchError((err) => of(genericActions.setApiConnectionFailed(true)))
      )
    )
  );

export default combineEpics(fetchQuantityTypes);
