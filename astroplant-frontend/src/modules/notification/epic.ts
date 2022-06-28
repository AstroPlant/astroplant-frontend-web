import { Epic, combineEpics } from "redux-observable";
import { of, concat } from "rxjs";
import { mergeMap, filter, delay } from "rxjs/operators";
import moment, { Moment } from "moment";
import Option from "~/utils/option";
import * as actions from "./actions";

/**
 * Listens to notification requests, and add notifications.
 */
const notificationRequestEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(actions.addNotificationRequest.match),
    mergeMap(action => {
      const { notification, timeout } = action.payload;
      const id = state$.value.notification.nextId;
      const nextId = id + 1;

      let time: Option<{ from: Moment; to: Moment }> = Option.none();
      if (timeout) {
        const from = moment();
        const to = moment().add(timeout, "ms");
        time = Option.some({ from, to });
      }

      const addObservable = of(
        actions.addNotificationSuccess(
          nextId,
          id.toString(),
          notification,
          time
        )
      );

      if (timeout) {
        return concat(
          addObservable,
          of(actions.removeNotification(id)).pipe(delay(timeout))
        );
      } else {
        return addObservable;
      }
    })
  );

export default combineEpics(notificationRequestEpic);
