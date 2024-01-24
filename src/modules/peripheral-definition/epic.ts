import { Epic, combineEpics } from "redux-observable";
import { switchMap, map, filter, reduce, catchError } from "rxjs/operators";
import * as genericActions from "~/modules/generic/actions";
import * as actions from "./actions";

import { api, schemas } from "~/api";
import { of } from "rxjs";

const fetchPeripheralDefinitions: Epic = (actions$, _state$) =>
  actions$.pipe(
    filter(genericActions.pageInitializationSuccess.match),
    switchMap(() => {
      return api
        .listPeripheralDefinitions(
          {
            withExpectedQuantityTypes: true,
          },
          { recursePages: true },
        )
        .pipe(
          map((response) => response.data),
          reduce(
            (all, quantityTypes) => all.concat(quantityTypes),
            [] as Array<schemas["PeripheralDefinition"]>,
          ),
          map(actions.addDefinitions),
          // TODO: fetching peripheral definitions is important for
          // initialization. Many views depend on us knowing the peripheral
          // definitions. Maybe there should be a global loading screen and
          // error screen?
          catchError(() => of(genericActions.setApiConnectionFailed(true))),
        );
    }),
  );

export default combineEpics(fetchPeripheralDefinitions);
