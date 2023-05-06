import { applyMiddleware, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { persistStore } from "redux-persist";
import { rootEpic, rootReducer } from "./root";

const logger = (store: any) => (next: any) => (action: any) => {
  if (import.meta.env.NODE_ENV !== "production") {
    console.group(action.type);
    console.info("dispatching", action);
  }
  let result = next(action);
  if (import.meta.env.NODE_ENV !== "production") {
    console.log("next state", store.getState());
    console.groupEnd();
  }
  return result;
};

const epicMiddleware = createEpicMiddleware();

export const store = createStore(
  rootReducer,
  applyMiddleware(logger, epicMiddleware)
);
export const persistor = persistStore(store);

epicMiddleware.run(rootEpic);
