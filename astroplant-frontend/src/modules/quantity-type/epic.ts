import { Epic, combineEpics } from "redux-observable";
import { switchMap, map, filter, catchError } from "rxjs/operators";
import { of } from "rxjs";
import * as genericActions from "~/modules/generic/actions";
import * as actions from "./actions";

import { api } from "~/api";

const fetchQuantityTypes: Epic = (actions$, _state$) =>
  actions$.pipe(
    filter(genericActions.pageInitializationSuccess.match),
    switchMap(() =>
      // TODO: walk pages
      api.listQuantityTypes({}).pipe(
        map((response) => response.data),
        map(actions.addQuantityTypes),
        catchError((_err) => of(genericActions.setApiConnectionFailed(true)))
      )
    )
  );

export default combineEpics(fetchQuantityTypes);
