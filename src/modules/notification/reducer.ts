import { createReducer, ActionType } from "typesafe-actions";
import { Moment } from "moment";
import * as actions from "./actions";
import Option from "utils/option";
import { Notification } from "./index";

export interface NotificationState {
  notifications: {
    [id: string]: {
      notification: Notification;
      time: Option<{ from: Moment; to: Moment }>;
    };
  };
  nextId: number;
}

const initial: NotificationState = {
  notifications: {},
  nextId: 0
};

export type NotificationAction = ActionType<typeof actions>;

export default createReducer<NotificationState, NotificationAction>(initial)
  .handleAction(actions.addNotificationSuccess, (state, action) => {
    const { nextId, id, notification, time } = action.payload;

    const addNotification = { notification, time };

    return {
      ...state,
      nextId: nextId,
      notifications: {
        ...state.notifications,
        [id.toString()]: addNotification
      }
    };
  })
  .handleAction(actions.removeNotification, (state, action) => {
    const { [action.payload]: _n, ...newNotifications } = state.notifications;
    return { ...state, notifications: newNotifications };
  });
