import { persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";
import { createReducer } from "@reduxjs/toolkit";
import * as actions from "./actions";

const sessionStoragePersistConfig = {
  key: "session",
  storage: sessionStorage,
};

export interface SessionState {
  initialized: boolean;
}

const initial: SessionState = {
  initialized: false,
};

const reducer = createReducer<SessionState>(initial, (build) =>
  build.addCase(actions.sessionInitialize, (state, action) => {
    state.initialized = true;
  })
);

export default persistReducer(sessionStoragePersistConfig, reducer);
