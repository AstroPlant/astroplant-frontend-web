import { combineEpics } from "redux-observable";
import { of, concat } from "rxjs";
import { mergeMap, filter, delay } from "rxjs/operators";
import { DateTime } from "luxon";
import * as actions from "./actions";
import { AppEpic } from "~/store";

/**
 * Listens to notification requests, and add notifications.
 */
const notificationRequestEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(actions.addNotificationRequest.match),
    mergeMap((action) => {
      const { notification, timeout } = action.payload;
      const id = state$.value.notification.nextId;
      const nextId = id + 1;

      let time: { from: DateTime; to: DateTime } | undefined;
      if (timeout) {
        const from = DateTime.now();
        const to = DateTime.now().plus({ milliseconds: timeout });
        time = { from, to };
      }

      const addObservable = of(
        actions.addNotificationSuccess(
          nextId,
          id.toString(),
          notification,
          time && { from: time.from.toISO()!, to: time.to.toISO()! },
        ),
      );

      if (timeout) {
        return concat(
          addObservable,
          of(actions.removeNotification(String(id))).pipe(delay(timeout)),
        );
      } else {
        return addObservable;
      }
    }),
  );

export default combineEpics(notificationRequestEpic);
