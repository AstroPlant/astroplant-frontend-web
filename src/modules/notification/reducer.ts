import { createReducer } from "@reduxjs/toolkit";
import * as actions from "./actions";
import { Notification } from "./index";

export interface NotificationState {
  notifications: {
    [id: string]: {
      notification: Notification;
      time?: {
        from: string;
        to: string;
      };
    };
  };
  nextId: number;
}

const initial: NotificationState = {
  notifications: {},
  nextId: 0,
};

export default createReducer<NotificationState>(initial, (build) =>
  build
    .addCase(actions.addNotificationSuccess, (state, action) => {
      const { nextId, id, notification, time } = action.payload;
      state.nextId = nextId;
      state.notifications[id.toString()] = { notification, time };
    })
    .addCase(actions.removeNotification, (state, action) => {
      delete state.notifications[action.payload];
    }),
);
