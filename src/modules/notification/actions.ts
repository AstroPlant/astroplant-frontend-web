import { createAction } from "typesafe-actions";
import { Moment } from "moment";
import { Notification } from "./index";
import Option from "utils/option";

export const addNotificationRequest = createAction(
  "notification/ADD_NOTIFICATION_REQUEST",
  action => (notification: Notification, timeout: number | null = 5000) =>
    action({ notification, timeout })
);

export const addNotificationSuccess = createAction(
  "notification/ADD_NOTIFICATION_SUCCESS",
  action => (
    nextId: number,
    id: string,
    notification: Notification,
    time: Option<{ from: Moment; to: Moment }>
  ) => action({ nextId, id, notification, time })
);

export const removeNotification = createAction(
  "notification/REMOVE_NOTIFICATION",
  action => (payload: string) => action(payload)
);
