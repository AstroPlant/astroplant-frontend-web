import { createAction } from "@reduxjs/toolkit";
import { DateTime } from "luxon";
import { Notification } from "./index";
import Option from "utils/option";

export const addNotificationRequest = createAction(
  "notification/ADD_NOTIFICATION_REQUEST",
  (notification: Notification, timeout: number | null = 5000) => ({
    payload: {
      notification,
      timeout,
    },
  })
);

export const addNotificationSuccess = createAction(
  "notification/ADD_NOTIFICATION_SUCCESS",
  (
    nextId: number,
    id: string,
    notification: Notification,
    time: Option<{ from: DateTime; to: DateTime }>
  ) => ({ payload: { nextId, id, notification, time } })
);

export const removeNotification = createAction<string>(
  "notification/REMOVE_NOTIFICATION"
);
