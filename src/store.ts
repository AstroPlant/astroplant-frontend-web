import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { persistStore, persistReducer } from "redux-persist";
import localStorage from "redux-persist/lib/storage";
import { rootReducer, rootEpic } from "./root";

const localStoragePersistConfig = {
  key: "root",
  whitelist: ["auth", "intl"],
  storage: localStorage
};

const logger = (store: any) => (next: any) => (action: any) => {
  console.group(action.type);
  console.info("dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  console.groupEnd();
  return result;
};

const epicMiddleware = createEpicMiddleware();
const persistedReducer = persistReducer(localStoragePersistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  applyMiddleware(logger, epicMiddleware)
);
export const persistor = persistStore(store);

epicMiddleware.run(rootEpic);
