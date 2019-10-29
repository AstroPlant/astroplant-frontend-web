import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";
import { tap } from "rxjs/operators";
//import intlReducer from "./modules/intl/reducer";
import authReducer from "./modules/auth/reducer";
import authEpic from "./modules/auth/epic";
import meReducer from "./modules/me/reducer";
import meEpic from "./modules/me/epic";
import kitReducer from "./modules/kit/reducer";
import kitEpic from "./modules/kit/epic";
import peripheralDefinitionReducer from "./modules/peripheral-definition/reducer";
import peripheralDefinitionEpic from "./modules/peripheral-definition/epic";
import notificationReducer from "./modules/notification/reducer";
import notificationEpic from "./modules/notification/epic";
import sessionReducer from "./modules/session/reducer";
import sessionEpic from "./modules/session/epic";
import webSocketEpic from "./modules/websocket/epic";

export const rootReducer = combineReducers({
  auth: authReducer,
  me: meReducer,
  kit: kitReducer,
  peripheralDefinition: peripheralDefinitionReducer,
  notification: notificationReducer,
  session: sessionReducer
});

// Slightly complicated root epic to ensure we throw all errors.
export const rootEpic = (...args: any[]) =>
  combineEpics(
    authEpic,
    meEpic,
    kitEpic,
    peripheralDefinitionEpic,
    notificationEpic,
    sessionEpic,
    webSocketEpic
  )(...args).pipe(
    tap({
      error: (e: any) =>
        setTimeout(() => {
          throw e;
        })
    })
  );
