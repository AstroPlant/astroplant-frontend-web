import { configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from "redux-persist";
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

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([logger, epicMiddleware]),
});
export const persistor = persistStore(store);

epicMiddleware.run(rootEpic);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
