import { createAction } from "typesafe-actions";
import { Kit, KitConfigurationWithPeripherals, KitConfiguration, Peripheral } from "astroplant-api";
import { RawMeasurement } from "./reducer";

interface WithKitSerial {
  serial: string;
}

export const addKit = createAction("kit/ADD", action => (payload: Kit) =>
  action(payload)
);

export const startWatching = createAction(
  "kit/START_WATCHING",
  action => (payload: { serial: string }) => action(payload)
);

export const stopWatching = createAction(
  "kit/STOP_WATCHING",
  action => (payload: { serial: string }) => action(payload)
);

export const kitConfigurationsRequest = createAction(
  "kit/KIT_CONFIGURATIONS_REQUEST",
  action => (payload: { serial: string }) => action(payload)
);

export const kitConfigurationsSuccess = createAction(
  "kit/KIT_CONFIGURATIONS_SUCCESS",
  action => (payload: {
    serial: string;
    configurations: KitConfigurationWithPeripherals[];
  }) => action(payload)
);

export const kitConfigurationCreated = createAction(
  "kit/KIT_CONFIGURATION_CREATED",
  action => (payload: {
    serial: string;
    configuration: KitConfiguration;
  }) => action(payload)
);

export const kitSetAllConfigurationsInactive = createAction(
  "kit/KIT_SET_ALL_CONFIGURATIONS_INACTIVE",
  action => (payload: {
    serial: string;
  }) => action(payload)
);

export const kitConfigurationUpdated = createAction(
  "kit/KIT_CONFIGURATION_UPDATED",
  action => (payload: {
    serial: string;
    configuration: KitConfiguration;
  }) => action(payload)
);

export const peripheralCreated = createAction(
  "kit/PERIPHERAL_CREATED",
  action => (payload: {
    serial: string;
    peripheral: Peripheral;
  }) => action(payload)
);

export const peripheralUpdated = createAction(
  "kit/PERIPHERAL_UPDATED",
  action => (payload: {
    serial: string;
    peripheral: Peripheral;
  }) => action(payload)
);

export const peripheralDeleted = createAction(
  "kit/PERIPHERAL_DELETED",
  action => (payload: {
    serial: string;
    peripheralId: string;
  }) => action(payload)
);

export const rawMeasurementReceived = createAction(
  "kit/RAW_MEASUREMENT",
  action => (serial: string, rawMeasurement: RawMeasurement) =>
    action({ serial, rawMeasurement })
);
