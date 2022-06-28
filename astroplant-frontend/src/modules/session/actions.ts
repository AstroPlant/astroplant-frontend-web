import { createAction } from "@reduxjs/toolkit";

export const sessionInitialize = createAction("session/INITIALIZE");
export const sessionInitialized = createAction("session/INITIALIZED");
