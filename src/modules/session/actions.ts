import { createAction } from "typesafe-actions";

export const sessionInitialize = createAction("session/INITIALIZE");
export const sessionInitialized = createAction("session/INITIALIZED");
