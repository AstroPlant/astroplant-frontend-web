import { createAction } from "@reduxjs/toolkit";
import { RawMeasurement } from "./reducer";

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
