import { createAction } from "@reduxjs/toolkit";
import { RawMeasurement } from "./reducer";
import { schemas } from "~/api";

export const fetchKit = createAction<{ serial: string }>("kit/FETCH");

export const addKit = createAction<schemas["Kit"]>("kit/ADD");
export const deleteKit = createAction<{
  serial: string;
  kitId: number;
}>("kit/DELETE");

export const notFound = createAction<{ serial: string }>("kit/NOT_FOUND");
export const notAuthorized = createAction<{ serial: string }>(
  "kit/NOT_AUTHORIZED",
);

export const startWatching = createAction<{ serial: string }>(
  "kit/START_WATCHING",
);

export const stopWatching = createAction<{ serial: string }>(
  "kit/STOP_WATCHING",
);

export const rawMeasurementReceived = createAction<{
  serial: string;
  rawMeasurement: RawMeasurement;
}>("kit/RAW_MEASUREMENT");
