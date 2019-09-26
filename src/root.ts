import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";
import { tap } from "rxjs/operators";
//import intlReducer from "./modules/intl/reducer";
import authReducer from "./modules/auth/reducer";
import authEpic from "./modules/auth/epic";
import sessionReducer from "./modules/session/reducer";
import sessionEpic from "./modules/session/epic";

export const rootReducer = combineReducers({
  //intl: intlReducer,
  auth: authReducer,
  session: sessionReducer
});

// Slightly complicated root epic to ensure we throw all errors.
export const rootEpic = (...args: any[]) =>
  combineEpics(authEpic, sessionEpic)(...args).pipe(
    tap({
      error: (e: any) =>
        setTimeout(() => {
          throw e;
        })
    })
  );
