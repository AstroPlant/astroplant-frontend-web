import { createReducer } from "@reduxjs/toolkit";
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
    })
);
