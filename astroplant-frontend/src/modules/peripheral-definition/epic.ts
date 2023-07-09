import { Epic, combineEpics } from "redux-observable";
import { switchMap, map, filter } from "rxjs/operators";
import * as genericActions from "~/modules/generic/actions";
import * as actions from "./actions";

import { api } from "~/api";

const fetchPeripheralDefinitions: Epic = (actions$, _state$) =>
  actions$.pipe(
    filter(genericActions.pageInitializationSuccess.match),
    switchMap(() => {
      // TODO: walk pages
      return api
        .listPeripheralDefinitions({
          withExpectedQuantityTypes: true,
        })
        .pipe(
          map((response) => response.data),
          map(actions.addDefinitions)
        );
    })
  );

export default combineEpics(fetchPeripheralDefinitions);
