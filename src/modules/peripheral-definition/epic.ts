import { isActionOf } from "typesafe-actions";
import { Epic, combineEpics } from "redux-observable";
import { switchMap, map, filter } from "rxjs/operators";
import * as genericActions from "modules/generic/actions";
import * as actions from "./actions";

import { PeripheralDefinitionApi } from "astroplant-api";
import { walkPages } from "utils/api";

const fetchPeripheralDefinitions: Epic = (actions$, state$) =>
  actions$.pipe(
    filter(isActionOf(genericActions.pageInitializationSuccess)),
    map(() => new PeripheralDefinitionApi()),
    switchMap((api: PeripheralDefinitionApi) =>
      walkPages(page => api.listPeripheralDefinitions({ after: page })).pipe(
        map(actions.addDefinitions)
      )
    )
  );

export default combineEpics(fetchPeripheralDefinitions);
