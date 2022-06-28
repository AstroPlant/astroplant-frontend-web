import { createAction } from "@reduxjs/toolkit";

export const pageInitializationSuccess = createAction(
  "generic/PAGE_INITIALIZATION_SUCCESS"
);
export const pageLoadSuccess = createAction("generic/PAGE_LOAD_SUCCESS");
export const setApiConnectionFailed = createAction(
  "generic/SET_API_CONNECTION_FAILED",
  (payload: boolean) => ({ payload })
);
