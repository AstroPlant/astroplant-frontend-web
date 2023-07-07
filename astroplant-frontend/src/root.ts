import { combineReducers } from "@reduxjs/toolkit";
import { combineEpics } from "redux-observable";
import { tap } from "rxjs/operators";
import genericReducer from "./modules/generic/reducer";
//import intlReducer from "./modules/intl/reducer";
import authReducer from "./modules/auth/reducer";
import authEpic from "./modules/auth/epic";
import meReducer from "./modules/me/reducer";
import meEpic from "./modules/me/epic";
import kitReducer from "./modules/kit/reducer";
import kitEpic from "./modules/kit/epic";
import peripheralDefinitionReducer from "./modules/peripheral-definition/reducer";
import peripheralDefinitionEpic from "./modules/peripheral-definition/epic";
import quantityTypeReducer from "./modules/quantity-type/reducer";
import quantityTypeEpic from "./modules/quantity-type/epic";
import notificationReducer from "./modules/notification/reducer";
import notificationEpic from "./modules/notification/epic";
import sessionReducer from "./modules/session/reducer";
import sessionEpic from "./modules/session/epic";
import webSocketEpic from "./modules/websocket/epic";
import { rtkApi } from "./services/astroplant";

export const rootReducer = combineReducers({
  generic: genericReducer,
  auth: authReducer,
  me: meReducer,
  kit: kitReducer,
  peripheralDefinition: peripheralDefinitionReducer,
  quantityType: quantityTypeReducer,
  notification: notificationReducer,
  session: sessionReducer,
  [rtkApi.reducerPath]: rtkApi.reducer,
});

// Slightly complicated root epic to ensure we throw all errors.
export const rootEpic = (...args: any[]) =>
  combineEpics(
    authEpic,
    meEpic,
    kitEpic,
    peripheralDefinitionEpic,
    quantityTypeEpic,
    notificationEpic,
    sessionEpic,
    webSocketEpic
  )(...args).pipe(
    tap({
      error: (e: any) =>
        setTimeout(() => {
          throw e;
        }),
    })
  );
