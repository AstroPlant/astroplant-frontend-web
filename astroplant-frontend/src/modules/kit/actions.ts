import { createAction } from "@reduxjs/toolkit";
import { RawMeasurement } from "./reducer";
import { schemas } from "~/api";

export const fetchKit = createAction<{ serial: string }>("kit/FETCH");

export const addKit = createAction<schemas["Kit"]>("kit/ADD");

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

export const kitConfigurationsRequest = createAction<{ serial: string }>(
  "kit/KIT_CONFIGURATIONS_REQUEST",
);

export const kitConfigurationsSuccess = createAction<{
  serial: string;
  configurations: Array<schemas["KitConfigurationWithPeripherals"]>;
}>("kit/KIT_CONFIGURATIONS_SUCCESS");

export const kitConfigurationCreated = createAction<{
  serial: string;
  configuration: schemas["KitConfiguration"];
}>("kit/KIT_CONFIGURATION_CREATED");

export const kitSetAllConfigurationsInactive = createAction<{
  serial: string;
  kitId: number;
}>("kit/KIT_SET_ALL_CONFIGURATIONS_INACTIVE");

export const kitConfigurationUpdated = createAction<{
  serial: string;
  configuration: schemas["KitConfiguration"];
}>("kit/KIT_CONFIGURATION_UPDATED");

export const peripheralCreated = createAction<{
  serial: string;
  peripheral: schemas["Peripheral"];
}>("kit/PERIPHERAL_CREATED");

export const peripheralUpdated = createAction<{
  serial: string;
  peripheral: schemas["Peripheral"];
}>("kit/PERIPHERAL_UPDATED");

export const peripheralDeleted = createAction<{
  serial: string;
  kitId: number;
  kitConfigurationId: number;
  peripheralId: number;
}>("kit/PERIPHERAL_DELETED");

export const rawMeasurementReceived = createAction<{
  serial: string;
  rawMeasurement: RawMeasurement;
}>("kit/RAW_MEASUREMENT");
