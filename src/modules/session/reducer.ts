import { persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";
import { createReducer, ActionType } from "typesafe-actions";
import * as actions from "./actions";

const sessionStoragePersistConfig = {
  key: "session",
  storage: sessionStorage
};

export interface SessionState {
  initialized: boolean;
}

const initial: SessionState = {
  initialized: false
};

export type SessionAction = ActionType<typeof actions>;

const reducer = createReducer<SessionState, SessionAction>(initial)
  .handleAction(actions.sessionInitialize, (state, action) => {
    return { ...state, initialized: true };
  });

export default persistReducer(sessionStoragePersistConfig, reducer);
