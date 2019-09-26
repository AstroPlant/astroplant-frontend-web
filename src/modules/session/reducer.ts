import * as types from "./actionTypes";
import sessionStorage from "redux-persist/lib/storage/session";
import { persistReducer } from "redux-persist";

const initial = {
  initialized: false
};

const sessionStoragePersistConfig = {
  key: "session",
  storage: sessionStorage
};

function reducer(state: any = initial, action: any) {
  switch (action.type) {
    case types.SESSION_INITIALIZE:
      return { ...state, initialized: true };
    default:
      return state;
  }
}

export default persistReducer(sessionStoragePersistConfig, reducer);
