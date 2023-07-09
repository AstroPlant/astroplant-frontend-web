import { Epic, combineEpics } from "redux-observable";
import { switchMap, map, filter, reduce } from "rxjs/operators";
import * as genericActions from "~/modules/generic/actions";
import * as actions from "./actions";

import { api, schemas } from "~/api";

const fetchPeripheralDefinitions: Epic = (actions$, _state$) =>
  actions$.pipe(
    filter(genericActions.pageInitializationSuccess.match),
    switchMap(() => {
      return api
        .listPeripheralDefinitions(
          {
            withExpectedQuantityTypes: true,
          },
          { recursePages: true }
        )
        .pipe(
          map((response) => response.data),
          reduce(
            (all, quantityTypes) => all.concat(quantityTypes),
            [] as Array<schemas["PeripheralDefinition"]>
          ),
          map(actions.addDefinitions)
        );
    })
  );

export default combineEpics(fetchPeripheralDefinitions);
